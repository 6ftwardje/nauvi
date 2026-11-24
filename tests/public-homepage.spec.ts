import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const indexableRoutes = [
  "/",
  "/platform",
  "/agents",
  "/werkwijze",
  "/toepassingen",
  "/toepassingen/offertes-voorbereiden",
  "/toepassingen/werfverslagen-maken",
  "/toepassingen/leveranciers-vergelijken",
  "/toepassingen/aanvragen-verwerken",
  "/toepassingen/leverbonnen-verwerken",
  "/toepassingen/facturen-opvolgen",
  "/toepassingen/offertes-opvolgen",
  "/toepassingen/meerwerken-signaleren",
  "/toepassingen/werfplanning-ondersteunen",
  "/toepassingen/werfmarges-bewaken",
  "/over-nauvi",
  "/careers",
  "/privacy",
  "/contact",
];

const canonicalFor = (path: string) => path === "/" ? "https://nauvi.ai" : `https://nauvi.ai${path}`;

function jsonLd(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(([, body]) => {
    const data = JSON.parse(body);
    return data["@graph"] ?? [data];
  });
}

function meta(html: string, key: string) {
  return html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`))?.[1];
}

test("Nauvi keeps its public homepage without public login links", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/^Nauvi/);
  await expect(page.getByRole("banner").getByRole("link", { name: "Nauvi startpagina" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Geef het werk dat blijft liggen uit handen.");
  // Hidden menus count too: the login links must not exist at all while /app has no approved target.
  await expect(page.locator("header a, footer a").filter({ hasText: /Inloggen|Login voor testgebruikers/ })).toHaveCount(0);
  await expect(page.locator('header a[href="/app"], footer a[href="/app"]')).toHaveCount(0);
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute("href", "/privacy");
  await expect(footer.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("href", "/contact");
  await expect(page.locator('a[href="/app"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Plan een kennismaking", exact: true }).first()).toBeVisible();
});

test("login redirects to Synaps, forwards only invitation parameters and is never indexed", async ({ request }) => {
  const login = await request.get("/app", { maxRedirects: 0 });
  expect(login.status()).toBe(307);
  expect(login.headers().location).toBe("https://synaps.example.test/app");
  expect(login.headers()["x-robots-tag"]).toContain("noindex");

  for (const key of ["invite", "token"]) {
    const incoming = `/?${key}=fictional%2Broute%2Fcheck&campaign=nauvi`;
    const legacy = await request.get(incoming, { maxRedirects: 0 });
    expect(legacy.status()).toBe(307);
    expect(legacy.headers().location).toBe(`/app?${key}=fictional%2Broute%2Fcheck`);

    const direct = await request.get(`/app${incoming.slice(1)}`, { maxRedirects: 0 });
    expect(direct.status()).toBe(307);
    expect(direct.headers().location).toBe(`https://synaps.example.test/app?${key}=fictional%2Broute%2Fcheck`);
    expect(direct.headers()["cache-control"]).toBe("no-store");
    expect(direct.headers()["x-robots-tag"]).toContain("noindex");
  }
});

test("robots.txt allows the site, keeps crawlers out of /app and points at the sitemap", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toContain("Allow: /\n");
  expect(text).toContain("Disallow: /app");
  expect(text).not.toMatch(/Disallow: \/\s*$/m);
  expect(text).toContain("Sitemap: https://nauvi.ai/sitemap.xml");
});

test("the sitemap lists exactly the indexable routes on nauvi.ai", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("xml");
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
  expect(urls).toEqual(indexableRoutes.map(path => path === "/" ? "https://nauvi.ai/" : `https://nauvi.ai${path}`));
});

test("netlify.toml holds only the confirmed 301s", () => {
  const toml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
  const rules = [...toml.matchAll(/\[\[redirects\]\]\s+from = "([^"]+)"\s+to = "([^"]+)"\s+status = (\d+)\s+force = (\w+)/g)]
    .map(([, from, to, status, force]) => ({ from, to, status, force }));
  const expected = { "/modules": "/", "/bedrijfsbrein": "/platform", "/company-brain": "/platform", "/over-ons": "/over-nauvi" };
  expect(rules).toEqual(Object.entries(expected).flatMap(([from, to]) => [from, `${from}/`].map(path => ({ from: path, to, status: "301", force: "true" }))));
  expect((toml.match(/\[\[redirects\]\]/g) ?? []).length).toBe(rules.length);
});

for (const path of indexableRoutes) {
  test(`${path} has a production canonical, share tags and site schema`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    // Local and Preview hosts are never indexable.
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    const html = await response.text();
    expect(html).toContain('<html lang="nl-BE"');
    expect(html).toContain(`<link rel="canonical" href="${canonicalFor(path)}"/>`);
    expect(meta(html, "og:url")).toBe(canonicalFor(path));
    expect(meta(html, "og:type")).toBe("website");
    expect(meta(html, "og:locale")).toBe("nl_BE");
    expect(meta(html, "og:site_name")).toBe("Nauvi");
    expect(meta(html, "og:title")).toBe(html.match(/<title>([^<]*)<\/title>/)?.[1]);
    expect(meta(html, "og:description")).toBe(meta(html, "description"));
    expect(meta(html, "og:image")).toMatch(/^https:\/\/nauvi\.ai\/marketing\/.+\.webp$/);
    expect(meta(html, "twitter:card")).toBe("summary_large_image");
    expect(html).not.toMatch(/twitter:(site|creator)/);

    const image = await request.get(new URL(meta(html, "og:image")!).pathname);
    expect(image.status()).toBe(200);

    const types = jsonLd(html).map(item => item["@type"]);
    expect(types).toEqual(expect.arrayContaining(["WebSite", "Organization"]));
    expect(types.includes("FAQPage")).toBe(path === "/");
    const organization = jsonLd(html).find(item => item["@type"] === "Organization");
    expect(Object.keys(organization).sort()).toEqual(["@id", "@type", "logo", "name", "url"]);
  });
}

test("the homepage FAQ schema matches the visible questions and answers", async ({ page, request }) => {
  const html = await (await request.get("/")).text();
  const faq = jsonLd(html).find(item => item["@type"] === "FAQPage");
  await page.goto("/");
  const visible = await page.locator("#vragen details").evaluateAll(items => items.map(item => ({
    question: item.querySelector("summary")?.textContent?.trim(),
    answer: [...item.querySelectorAll("p")].map(paragraph => paragraph.textContent?.trim()).join(" "),
  })));
  expect(visible).toHaveLength(8);
  expect(faq.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({ question: item.name, answer: item.acceptedAnswer.text }))).toEqual(visible);
  expect(visible.at(-1)?.answer).toBe("Open je persoonlijke uitnodigingslink om toegang te krijgen tot de testomgeving.");
});

test("the production host is not marked noindex", async ({ request }) => {
  const response = await request.get("/", { headers: { host: "nauvi.ai" } });
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBeUndefined();
});

test("unknown paths still answer 404", async ({ request }) => {
  expect((await request.get("/niet-bestaand-pad-xyz", { maxRedirects: 0 })).status()).toBe(404);
});

test("the privacy page shows its open facts and restates only the homepage FAQ", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page).toHaveTitle("Privacy | Nauvi");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await expect(main.getByRole("heading", { level: 2 })).toHaveText(["Wie we zijn", "Welke gegevens we verwerken", "Waar gegevens staan", "Hoe lang we gegevens bewaren", "Cookies", "Contact over privacy"]);
  for (const fact of ["wettelijke naam", "ondernemingsnummer", "BTW-nummer", "adres", "welke gegevens, voor welke doelen", "overige verwerkers", "welke cookies, waarvoor, hoe je ze weigert", "privacy-e-mail of ander contactpunt"]) {
    await expect(main.getByText(`[TE BEVESTIGEN: ${fact}]`, { exact: true })).toBeVisible();
  }
  await expect(main.getByText(/Hetzner in Duitsland/)).toBeVisible();
  await expect(main.getByText(/uiterlijk 12 maanden na het einde van de samenwerking/)).toBeVisible();
  await expect(main.getByRole("link", { name: "contactpagina" })).toHaveAttribute("href", "/contact");
  await expect(main.locator("form")).toHaveCount(0);
});

test("the contact page opens the existing booking dialog and shows its open facts", async ({ page }) => {
  await page.route("https://calendly.com/**", route => route.abort());
  await page.goto("/contact");
  await expect(page).toHaveTitle("Contact | Nauvi");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1, name: "Contact" })).toBeVisible();
  for (const fact of ["e-mail", "telefoon", "adres", "ondernemingsnummer / BTW"]) {
    await expect(main.getByText(`[TE BEVESTIGEN: ${fact}]`, { exact: true })).toBeVisible();
  }
  await expect(main.getByRole("link", { name: "privacypagina" })).toHaveAttribute("href", "/privacy");
  await expect(main.locator("form")).toHaveCount(0);
  await expect(main.getByRole("button")).toHaveCount(1);
  await main.getByRole("button", { name: "Plan een kennismaking", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Plan een kennismaking" })).toBeVisible();
});

test("the about page sends contact to /contact", async ({ page }) => {
  await page.goto("/over-nauvi");
  await expect(page.getByRole("link", { name: "Naar contact" })).toHaveAttribute("href", "/contact");
});

test("desktop hover switches between the solutions and company menus, and Escape dismisses the menu", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", { name: "Meer over Nauvi" });
  const solutions = header.getByRole("button", { name: "Oplossingen", exact: true });
  await solutions.hover();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");
  await expect(header.getByRole("link", { name: /^Nauvi Agents/ })).toHaveAttribute("href", "/agents");
  await header.getByRole("link", { name: "Over Nauvi", exact: true }).hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(solutions).toHaveAttribute("aria-expanded", "false");
  const menu = header.locator("#nav-menu-over");
  await expect(menu.getByRole("link", { name: /Werken bij Nauvi/ }).first()).toBeVisible();
  const width = await menu.evaluate(element => element.getBoundingClientRect().width);
  expect(width).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  await trigger.focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("application tabs keep their selection until a click or key activates another", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tablist", { name: "Toepassingen" });
  const first = tabs.getByRole("tab", { name: "Aanvragen & offertes" });
  const second = tabs.getByRole("tab", { name: "Werf & planning" });
  await second.hover();
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: "Aanvragen & offertes" })).toBeVisible();
  await second.click();
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: "Werf & planning" })).toBeVisible();
  await second.press("ArrowLeft");
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute("aria-selected", "true");
});

test("reduced motion leaves the hero poster in place without loading video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const video = page.locator("main video");
  await expect(page.getByRole("button", { name: "Beeldwissel afspelen" })).toBeVisible();
  await expect(video).not.toHaveAttribute("src", /./);
  await expect(page.getByRole("heading", { level: 1 }).locator("span").first()).toHaveCSS("opacity", "1");
});

test("the walkthrough replaces the old layers and leads into the product benefits", async ({ page }) => {
  await page.goto("/platform");
  await expect(page.getByRole("heading", { name: "De lagen van Company Brain." })).toHaveCount(0);
  await expect(page.locator("#mogelijkheden + section")).toHaveAccessibleName("Zo werkt Company Brain.");
  const benefits = page.getByRole("region", { name: "Wat één gedeelde kennisbasis oplevert." });
  await expect(benefits.getByRole("listitem")).toHaveCount(5);
  await expect(benefits.getByRole("heading", { name: "Kennis hergebruiken" })).toBeVisible();
});

test("the mobile navigation opens the careers page and the vacancies section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu openen" }).click();
  const menu = page.getByRole("navigation", { name: "Mobiele hoofdnavigatie" });
  await expect(menu.getByRole("link", { name: /inloggen|login/i })).toHaveCount(0);
  await menu.getByRole("link", { name: "Werken bij Nauvi" }).click();
  await expect(page).toHaveURL(/\/careers$/);
  await expect(page.getByRole("heading", { level: 1, name: "Werken bij Nauvi" })).toBeVisible();
  await page.getByRole("link", { name: "Bekijk de vacatures" }).click();
  await expect(page).toHaveURL(/#vacatures$/);
  await expect(page.getByRole("heading", { name: "Vacatures", exact: true })).toBeInViewport();
  const openings = page.getByRole("region", { name: "Vacatures", exact: true });
  await expect(openings.getByRole("heading", { name: "Sales", exact: true })).toBeVisible();
  await expect(openings.getByRole("heading", { name: "Forward Deployed Engineer", exact: true })).toBeVisible();
  await expect(openings.getByRole("link", { name: "Solliciteer voor Sales" }))
    .toHaveAttribute("href", "mailto:careers@example.test?subject=Sollicitatie%20voor%20Sales%20bij%20Nauvi");
  await expect(openings.getByRole("link", { name: "Solliciteer voor Forward Deployed Engineer" }))
    .toHaveAttribute("href", "mailto:careers@example.test?subject=Sollicitatie%20voor%20Forward%20Deployed%20Engineer%20bij%20Nauvi");
});

test("the product walkthrough follows the hero and preserves edited approvals when switching demos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/platform");
  const demo = page.getByRole("region", { name: "Van kennis naar uitgevoerd werk." });
  const tabs = demo.getByRole("tablist");
  const knowledge = tabs.getByRole("tab", { name: "Kennis vastleggen" });
  const review = tabs.getByRole("tab", { name: "Werk goedkeuren" });
  await expect(page.locator('section[aria-labelledby="company-brain-heading"] + section')).toHaveAttribute("id", "mogelijkheden");
  await expect(knowledge).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "92");

  await knowledge.focus();
  await page.keyboard.press("End");
  await expect(review).toBeFocused();
  const panel = demo.getByRole("tabpanel", { name: "Werk goedkeuren" });
  await panel.getByRole("button", { name: "Aanpassen" }).click();
  await panel.getByRole("textbox", { name: "Antwoord op een klantvraag" }).fill("We sturen je vrijdag een voorstel.");
  await panel.getByRole("button", { name: "Opslaan" }).click();
  await knowledge.click();
  await review.click();
  await expect(panel.getByText("We sturen je vrijdag een voorstel.")).toBeVisible();
  await panel.getByRole("button", { name: "Goedkeuren", exact: true }).click();
  await expect(panel.getByRole("heading", { name: "Jouw akkoord is vastgelegd" })).toBeVisible();
});

test("existing product fragments open the matching demo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/platform#bedrijfskennis");
  const demo = page.getByRole("region", { name: "Van kennis naar uitgevoerd werk." });
  await expect(demo.getByRole("tab", { name: "Bronnen verkennen" })).toHaveAttribute("aria-selected", "true");
  await demo.getByRole("button", { name: "Hoe maken we een offerte?" }).click();
  await expect(demo.getByText(/Volgens jullie werkwijze begint een offerte/).filter({ visible: true })).toBeVisible();
  await page.getByRole("contentinfo").getByRole("link", { name: "Nauvi Agents" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "AI-agents voor kantoor en werf." })).toBeVisible();
  await page.getByRole("link", { name: "Probeer de interactieve demo" }).click();
  await expect(demo.getByRole("tab", { name: "Agents aan het werk" })).toHaveAttribute("aria-selected", "true");
});

test("the knowledge demo can be paused and replayed to completion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/platform");
  const demo = page.getByRole("region", { name: "Van kennis naar uitgevoerd werk." });
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole("button", { name: "Pauzeer voorbeeld Company Brain" }).click();
  const replay = demo.getByRole("button", { name: "Speel voorbeeld Company Brain opnieuw af" });
  await replay.click();
  await expect(demo.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "92", { timeout: 7000 });
  await expect(replay).toBeVisible();
});
