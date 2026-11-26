import { expect, test } from "@playwright/test";

test("the site report demo connects its sources, review and downloads", async ({ page, request }) => {
  await page.goto("/toepassingen/werfverslagen-maken");
  await page.getByRole("link", { name: "Bekijk het voorbeeld" }).click();
  await expect(page).toHaveURL(/\/toepassingen\/werfverslagen-maken#voorbeeld$/);

  const recording = page.locator("audio");
  await page.getByRole("button", { name: "Speel spraakbericht af" }).click();
  await expect.poll(() => recording.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pauzeer spraakbericht" }).click();
  await expect.poll(() => recording.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  const seek = page.getByRole("slider", { name: "Positie in het spraakbericht" });
  await expect(seek).toBeEnabled();
  await seek.press("End");
  await expect.poll(() => recording.evaluate((audio: HTMLAudioElement) => audio.duration - audio.currentTime)).toBeLessThan(0.1);
  await seek.press("Home");
  await expect.poll(() => recording.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeLessThan(0.1);
  await seek.press("ArrowRight");
  await expect.poll(() => recording.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0.1);

  await page.getByText("Lees de transcriptie", { exact: true }).click();
  await expect(page.getByText(/^Hey, even een update van de Parklaan/)).toBeVisible();
  await page.getByText("Lees de transcriptie", { exact: true }).press("Enter");
  await expect(page.getByText(/^Hey, even een update van de Parklaan/)).toBeHidden();

  const photo = page.getByRole("button", { name: /^Vergroot foto 1/ });
  await photo.press("Enter");
  const preview = page.getByRole("dialog", { name: "Werffoto bekijken" });
  await expect(preview.getByRole("img", { name: /stelling aan de voorgevel/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(preview).toBeHidden();
  await expect(photo).toBeFocused();

  await page.getByRole("navigation", { name: "Stappen in de productdemo" }).getByRole("link", { name: "Concept", exact: true }).click();
  await expect(page).toHaveURL(/#demo-concept$/);
  await expect(page.getByRole("table", { name: "Actiepunten" }).getByText("25 nov. om 10 uur")).toBeVisible();
  await page.getByRole("link", { name: "Foto 1", exact: true }).click();
  await expect(page).toHaveURL(/#demo-foto-1$/);
  const templateLink = page.getByRole("link", { name: "Werfverslag-sjabloon Word" });
  const pdfLink = page.getByRole("link", { name: "Voorbeeldverslag PDF" });
  const template = await request.get(await templateLink.getAttribute("href") ?? "");
  expect(template.ok()).toBe(true);
  expect(template.headers()["content-type"]).toContain("wordprocessingml.document");
  const examplePdf = await request.get(await pdfLink.getAttribute("href") ?? "");
  expect(examplePdf.ok()).toBe(true);
  expect(examplePdf.headers()["content-type"]).toContain("application/pdf");
  for (const [link, filename] of [[templateLink, "werfverslag-sjabloon.docx"], [pdfLink, "werfverslag-parklaan-voorbeeld.pdf"]] as const) {
    const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
    expect(download.suggestedFilename()).toBe(filename);
  }
  const audio = await request.get("/marketing/demos/werfnotitie.mp3");
  expect(audio.ok()).toBe(true);
  expect(audio.headers()["content-type"]).toContain("audio/mpeg");

  const report = page.getByRole("region", { name: "Een werfverslag maken uit spraak en foto’s" });
  await expect(report.getByRole("link", { name: "Plan een kennismaking" })).toHaveAttribute("href", "/contact");
  await expect(report.getByRole("link", { name: "Bekijk onze werkwijze" })).toHaveAttribute("href", "/werkwijze");
  await expect(report.getByRole("link", { name: "Bekijk het offertevoorbeeld" })).toHaveAttribute("href", "/toepassingen/offertes-voorbereiden#voorbeeld");
});
