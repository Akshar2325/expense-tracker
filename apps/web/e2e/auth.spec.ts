import { test, expect, Page } from "@playwright/test";

function uniqueEmail() {
  return `pw-${Date.now()}-${Math.floor(Math.random() * 9999)}@test.local`;
}

async function registerUser(page: Page, email: string) {
  await page.goto("/register");
  await page.getByLabel("First name").fill("Playwright");
  await page.getByLabel("Last name").fill("Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Test@12345");
  await page.getByLabel("Confirm password").fill("Test@12345");
  await page.getByRole("button", { name: /Create Account/i }).click();
}

test.describe("Auth flow", () => {
  test("registers a new user and lands on the dashboard", async ({ page }) => {
    const email = uniqueEmail();
    await registerUser(page, email);

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 55000 });
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    // Header shows displayName, not email
    await expect(page.getByText("Playwright Tester")).toBeVisible();
  });

  test("logs out and returns to the login page", async ({ page }) => {
    const email = uniqueEmail();
    await registerUser(page, email);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 55000 });

    await page.getByRole("button", { name: /Log out/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 25000 });
  });

  test("logs in with existing credentials", async ({ page }) => {
    const email = uniqueEmail();
    await registerUser(page, email);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 55000 });

    // Log out then back in
    await page.getByRole("button", { name: /Log out/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 25000 });

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("Test@12345");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 55000 });
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });

  test("shows an error for wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@test.local");
    await page.getByLabel("Password").fill("WrongPass123");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible({
      timeout: 15000,
    });
  });
});
