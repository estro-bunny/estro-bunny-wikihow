import { test, expect } from "@playwright/test";

test.describe("Article page smoke", () => {
  test("renders article navigation chrome", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("library-article-card").first().click();

    const article = page.getByTestId("article-page");
    await expect(article).toBeVisible();
    await expect(article.locator("h1")).toBeVisible();
    await expect(page.locator(".article-breadcrumb")).toBeVisible();
    await expect(page.locator(".article-sidebar")).toBeVisible();
    await expect(page.locator(".reading-progress")).toBeVisible();
  });

  test("renders the narrator on an article", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("library-article-card").first().click();
    const narrator = page.locator(".narrator");
    await expect(narrator).toBeVisible();
    await expect(page.getByTestId("narrator-play")).toBeVisible();
    await expect(page.getByTestId("narrator-stop")).toBeVisible();
    await expect(page.getByTestId("narrator-voice")).toBeVisible();
    await expect(page.getByTestId("narrator-speed")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-controls")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-start")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-skip")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-status")).toBeVisible();
  });
});
