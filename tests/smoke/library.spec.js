import { test, expect } from "@playwright/test";

test.describe("Library smoke", () => {
  test("loads the library with core UI", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", message => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator(".topbar")).toBeVisible();
    await expect(page.locator(".library-hero")).toBeVisible();
    await expect(page.locator(".article-grid")).toBeVisible();
    await expect(page.locator(".chaos-mode-control")).toBeVisible();
    await expect(page.locator(".article-card").first()).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("can open an article from the library", async ({ page }) => {
    await page.goto("/");
    await page.locator(".article-card").first().click();

    await expect(page.locator(".article-page")).toBeVisible();
    await expect(page.locator(".article-page h1")).toBeVisible();
    await expect(page.locator(".article-sidebar")).toBeVisible();
    await expect(page.locator(".reading-progress")).toBeVisible();
  });
});
