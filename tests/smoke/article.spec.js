import { test, expect } from "@playwright/test";

test.describe("Article page smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const state = { speaking: false, paused: false };
      const voices = [{ name: "EstroBunny Test Voice", lang: "en-US", voiceURI: "estro-bunny-test", default: true }];
      class MockSpeechSynthesisUtterance {
        constructor(text) {
          this.text = text;
          this.voice = null;
          this.lang = "en-US";
          this.rate = 1;
          this.pitch = 1;
          this.volume = 1;
          this.onstart = null;
          this.onend = null;
          this.onerror = null;
        }
      }
      window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
      window.speechSynthesis = {
        getVoices: () => voices,
        addEventListener: () => {},
        removeEventListener: () => {},
        speak(utterance) {
          state.speaking = true;
          state.paused = false;
          window.setTimeout(() => utterance.onstart?.(), 0);
        },
        pause() {
          if (state.speaking) state.paused = true;
        },
        resume() {
          if (state.speaking) state.paused = false;
        },
        cancel() {
          state.speaking = false;
          state.paused = false;
        },
        get speaking() { return state.speaking; },
        get paused() { return state.paused; }
      };
    });
  });
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

  test("exercises narrator playback state transitions", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("library-article-card").first().click();

    const narrator = page.locator(".narrator");
    const queueStatus = page.getByTestId("narrator-queue-status");

    await expect(narrator).toBeVisible();
    await expect(page.getByTestId("narrator-play")).toBeVisible();
    await expect(queueStatus).toContainText(/\d+\/\d+ SEGMENTS/);

    await page.getByTestId("narrator-play").click();
    await expect(page.getByTestId("narrator-pause")).toBeVisible();
    await expect(narrator.locator(".narrator-live")).toHaveText("● LIVE");
    await expect(queueStatus).toContainText(/\d+\/\d+ SEGMENTS/);

    await page.getByTestId("narrator-pause").click();
    await expect(page.getByTestId("narrator-resume")).toBeVisible();
    await expect(narrator.locator(".narrator-live")).toHaveText("● LIVE");
    await expect(queueStatus).toContainText(/\d+\/\d+ SEGMENTS/);

    await page.getByTestId("narrator-resume").click();
    await expect(page.getByTestId("narrator-pause")).toBeVisible();
    await expect(narrator.locator(".narrator-live")).toHaveText("● LIVE");
    await expect(queueStatus).toContainText(/\d+\/\d+ SEGMENTS/);

    await page.getByTestId("narrator-stop").click();
    await expect(page.getByTestId("narrator-play")).toBeVisible();
    await expect(narrator.locator(".narrator-idle")).toHaveText("○ STANDBY");
    await expect(queueStatus).toContainText(/\d+\/\d+ SEGMENTS/);

    await expect(page.getByTestId("narrator-voice")).toBeVisible();
    await expect(page.getByTestId("narrator-speed")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-controls")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-start")).toBeVisible();
    await expect(page.getByTestId("narrator-queue-skip")).toBeVisible();
  });
});
