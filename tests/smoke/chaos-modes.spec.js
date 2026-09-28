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
      const control = page.getByTestId("chaos-mode-control");
      const label = page.getByTestId("chaos-mode-label");

      for (let i = 0; i < MODES.length; i++) {
        if (await control.getAttribute("data-mode") === chaosMode.id) break;
        await control.click();
      }

      await expect(page.getByTestId("library-view")).toHaveAttribute("data-chaos-mode", chaosMode.id);
      await expect(label).toHaveText(chaosMode.label);

      await page.reload();
      await expect(page.getByTestId("library-view")).toHaveAttribute("data-chaos-mode", chaosMode.id);

      await page.getByTestId("library-article-card").first().click();
      await expect(page.getByTestId("article-page")).toHaveAttribute("data-chaos-mode", chaosMode.id);
      await expect(page.getByTestId("chaos-mode-label")).toHaveText(chaosMode.label);

      await page.goto("/definitely-not-a-real-estrobunny-route");
      await expect(page.getByTestId("not-found-view")).toHaveAttribute("data-chaos-mode", chaosMode.id);
      await expect(page.getByTestId("chaos-mode-label")).toHaveText(chaosMode.label);
    });
  }
});
