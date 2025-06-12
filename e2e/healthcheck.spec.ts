import { test, expect } from "@playwright/test";

// Basic smoke test to ensure the homepage renders
// Feel free to replace or remove once real specs are added.

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Workout Tracker/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
