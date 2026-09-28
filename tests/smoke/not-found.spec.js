import { test, expect } from "@playwright/test";

test("renders the not-found page without crashing", async ({ page }) => {
  await page.goto("/definitely-not-a-real-estrobunny-route");

  await expect(page.getByTestId("not-found-view")).toBeVisible();
  await expect(page.getByTestId("not-found-message")).toBeVisible();
  await expect(page.getByTestId("chaos-mode-control")).toBeVisible();
});
