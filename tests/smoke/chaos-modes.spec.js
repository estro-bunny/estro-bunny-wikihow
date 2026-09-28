import { test, expect } from "@playwright/test";

const MODES = [
  { id: "calm", label: "CALM" },
  { id: "chaotic", label: "CHAOTIC" },
  { id: "estro-bunny", label: "ESTROBUNNY" },
  { id: "documentation-failed", label: "DOCS FAILED" },
];

test.describe("Global Chaos Modes smoke", () => {
  for (const chaosMode of MODES) {
    test("applies " + chaosMode.id + " and persists it", async ({ page }) => {
      await page.goto("/");
      const control = page.locator(".chaos-mode-control").first();

      for (let i = 0; i < MODES.length; i++) {
        if (await control.getAttribute("data-mode") === chaosMode.id) break;
        await control.click();
      }

      await expect(page.locator("[data-chaos-mode]").first()).toHaveAttribute("data-chaos-mode", chaosMode.id);
      await expect(control).toContainText(chaosMode.label);

      await page.reload();
      await expect(page.locator("[data-chaos-mode]").first()).toHaveAttribute("data-chaos-mode", chaosMode.id);

      await page.locator(".article-card").first().click();
      await expect(page.locator("[data-chaos-mode]").first()).toHaveAttribute("data-chaos-mode", chaosMode.id);

      await page.goto("/definitely-not-a-real-estrobunny-route");
      await expect(page.locator("[data-chaos-mode]").first()).toHaveAttribute("data-chaos-mode", chaosMode.id);
    });
  }
});
