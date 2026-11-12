import { test, expect } from "@playwright/test";

test("Nauvi keeps its public homepage and separate login link", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/^Nauvi/);
  await expect(page.getByRole("banner").getByRole("link", { name: "Nauvi startpagina" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Geef het werk dat blijft liggen uit handen.");
  await expect(page.getByRole("link", { name: "Inloggen", exact: true })).toHaveAttribute("href", "/app");
  await expect(page.getByRole("button", { name: "Plan een kennismaking", exact: true }).first()).toBeVisible();
});

test("login redirects to Synaps and forwards only invitation parameters", async ({ request }) => {
  const login = await request.get("/app", { maxRedirects: 0 });
  expect(login.status()).toBe(307);
  expect(login.headers().location).toBe("https://synaps.example.test/app");

  for (const key of ["invite", "token"]) {
    const incoming = `/?${key}=fictional%2Broute%2Fcheck&campaign=nauvi`;
    const legacy = await request.get(incoming, { maxRedirects: 0 });
    expect(legacy.status()).toBe(307);
    expect(legacy.headers().location).toBe(`/app?${key}=fictional%2Broute%2Fcheck`);

    const direct = await request.get(`/app${incoming.slice(1)}`, { maxRedirects: 0 });
    expect(direct.status()).toBe(307);
    expect(direct.headers().location).toBe(`https://synaps.example.test/app?${key}=fictional%2Broute%2Fcheck`);
    expect(direct.headers()["cache-control"]).toBe("no-store");
  }
});

test("desktop hover opens the full-width company menu and Escape dismisses it", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", { name: "Meer over Nauvi" });
  const platform = header.getByRole("button", { name: "Meer over platform" });
  await header.getByRole("link", { name: "Platform", exact: true }).hover();
  await expect(platform).toHaveAttribute("aria-expanded", "true");
  await header.getByRole("link", { name: "Over Nauvi", exact: true }).hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(platform).toHaveAttribute("aria-expanded", "false");
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
  await menu.getByRole("link", { name: "Werken bij Nauvi" }).click();
  await expect(page).toHaveURL(/\/careers$/);
  await expect(page.getByRole("heading", { level: 1, name: "Werken bij Nauvi" })).toBeVisible();
  await page.getByRole("link", { name: "Bekijk de vacatures" }).click();
  await expect(page).toHaveURL(/#vacatures$/);
  await expect(page.getByRole("heading", { name: "Vacatures", exact: true })).toBeInViewport();
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
  await page.getByRole("contentinfo").getByRole("link", { name: "AI-agents" }).click();
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
