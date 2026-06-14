import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("ProNPS")).toBeVisible();
  await expect(page.getByRole("link", { name: "Створити компанію" }).first()).toBeVisible();
});
