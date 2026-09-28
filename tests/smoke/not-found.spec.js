import { test, expect } from "@playwright/test";

test("renders the not-found page without crashing", async ({ page }) => {
  await page.goto("/definitely-not-a-real-estrobunny-route");

  await expect(page.locator(".not-found")).toBeVisible();
  await expect(page.locator(".chaos-mode-control")).toBeVisible();
  await expect(page.locator("body")).toContainText(/404|NOT FOUND|NOT-FOUND/i);
});
