import { test, expect } from "@playwright/test";

test.describe("Basic Health Checks", () => {
  test("homepage loads with correct title", async ({ page }) => {
    // Navigate to the homepage and wait for network to be idle
    await page.goto("/", { waitUntil: "networkidle" });

    // Check the page title matches the expected value
    await expect(page).toHaveTitle(/RepRift/i);

    // Check if the root element is present
    await expect(page.locator("#root")).toBeVisible();

    // Check if the main app container is rendered
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigation elements are present", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Check for navigation elements that should be present on most pages
    const navBar = page.locator("nav");
    await expect(navBar).toBeVisible();

    // Check for common UI elements
    await expect(
      page
        .getByRole("link", { name: /sign in/i })
        .or(page.getByRole("link", { name: /dashboard/i }))
    ).toBeVisible();
  });
});
