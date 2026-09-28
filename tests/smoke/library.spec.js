import { test, expect } from "@playwright/test";

test.describe("Library smoke", () => {
  test("loads the library with core UI", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", message => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/");
    await expect(page.getByTestId("library-view")).toBeVisible();
    await expect(page.getByTestId("library-hero")).toBeVisible();
    await expect(page.getByTestId("library-article-card").first()).toBeVisible();
    await expect(page.getByTestId("chaos-mode-control")).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("can open an article from the library", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("library-article-card").first().click();

    await expect(page.getByTestId("article-page")).toBeVisible();
    await expect(page.getByTestId("article-page").locator("h1")).toBeVisible();
    await expect(page.locator(".article-sidebar")).toBeVisible();
    await expect(page.locator(".reading-progress")).toBeVisible();
  });
});
