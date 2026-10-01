import { expect, test } from "@playwright/test";

test("public homepage renders hero, listings and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Drive something extraordinary." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Featured inventory" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await page.screenshot({ path: "test-results/home.png", fullPage: true });
});

test("search filters the listing grid", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search make or model").fill("porsche");
  await expect(page.getByRole("heading", { name: /Porsche 911/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Tesla/ })).toHaveCount(0);
});

test("login page is reachable from the navbar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("dashboard redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("footer theme switch toggles light/dark and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await page.getByRole("radio", { name: "Light" }).click();
  await expect(html).not.toHaveClass(/dark/);
  await page.reload();
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(html).toHaveClass(/dark/);
});
