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
