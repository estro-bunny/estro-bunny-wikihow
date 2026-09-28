import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /ESTROBUNNY WIKIHOW/i })
  ).toBeVisible();
});
