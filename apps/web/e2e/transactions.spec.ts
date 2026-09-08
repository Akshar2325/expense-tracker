import { test, expect, Page } from "@playwright/test";

let sharedEmail: string;

function uniqueEmail() {
  return `pw-txn-${Date.now()}@test.local`;
}

async function registerAndLand(page: Page) {
  sharedEmail = uniqueEmail();
  await page.goto("/register");
  await page.getByLabel("First name").fill("PW");
  await page.getByLabel("Last name").fill("Tx");
  await page.getByLabel("Email").fill(sharedEmail);
  await page.getByLabel("Password", { exact: true }).fill("Test@12345");
  await page.getByLabel("Confirm password").fill("Test@12345");
  await page.getByRole("button", { name: /Create Account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
}

test.describe.configure({ mode: "serial" });

test.describe("Transactions", () => {
  test("can add a transaction from the transactions page", async ({ page }) => {
    await registerAndLand(page);

    await page.goto("/transactions");
    await expect(
      page.getByRole("heading", { name: "Transactions" }),
    ).toBeVisible();

    // Open the add-modal
    await page.getByRole("button", { name: /Add Transaction/i }).first().click();
    await expect(
      page.getByRole("dialog").or(page.locator(".rounded-xxl"))
    ).toBeAttached();

    // Fill the form
    await page.getByPlaceholder("e.g. Groceries at Big Bazaar").fill("Morning Coffee");
    await page.getByPlaceholder("0.00").fill("120.50");

    // Select the default Cash account (skip the placeholder option)
    const accountSelect = page.locator("form select.input").first();
    await accountSelect.selectOption({ label: "Cash" });

    // Submit (scope to the modal form to avoid the page-level button)
    await page
      .locator("form")
      .getByRole("button", { name: /Add Transaction/i })
      .click();

    // Wait for the newly created transaction to appear in the list
    await expect(page.getByText("Morning Coffee")).toBeVisible({
      timeout: 45000,
    });
  });

  test("searches transactions", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(sharedEmail);
    await page.getByLabel("Password").fill("Test@12345");
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 65000 });

    await page.goto("/transactions");
    await page.getByPlaceholder("Search transactions…").fill("Morning Coffee");
    await expect(page.getByText("Morning Coffee")).toBeVisible();
  });
});
