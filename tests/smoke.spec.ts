import { test, expect } from "@playwright/test";

test("renders hero and all sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Matthew Ketas" })).toBeVisible();
  for (const id of ["academics", "experience", "projects", "leadership", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("nav anchors reach their sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation").getByRole("link", { name: "Experience" }).click();
  await expect(page).toHaveURL(/#experience/);
});

test("experience timeline draws its trace bundle", async ({ page }) => {
  await page.goto("/");
  await page.locator("#experience").scrollIntoViewIfNeeded();
  const paths = page.locator("#experience svg path");
  await expect(paths.first()).toBeAttached();
  expect(await paths.count()).toBeGreaterThanOrEqual(10);
});

test("contact form validates before sending", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator('[aria-live="polite"]')).toContainText(/required/i);
});

test("contact form hands off to mailto on valid submit", async ({ page }) => {
  await page.goto("/#contact");
  // No backend on this static deploy: submitting opens a mailto: link, which
  // browsers block as a popup/navigation in automated contexts. Assert on the
  // href we build instead of the OS handoff itself.
  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Subject").fill("Hello");
  await page.getByLabel("Message").fill("This is a test message with enough length.");
  await page.getByRole("button", { name: "Send message" }).click();
  const status = page.locator('[aria-live="polite"]');
  await expect(status).toContainText(/email app/i, { timeout: 10_000 });
});
