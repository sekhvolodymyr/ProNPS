const { chromium } = require("@playwright/test");

async function main() {
  const stamp = Date.now();
  const email = `smoke-${stamp}@example.com`;
  const companyName = `Smoke Company ${stamp}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/register", { waitUntil: "networkidle" });
  await page.fill('input[name="companyName"]', companyName);
  await page.fill('input[name="category"]', "Clinic");
  await page.fill('input[name="website"]', "https://example.com");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 30000 });

  const reviewLink = await page.locator('a[href*="/r/"]').first().getAttribute("href");
  if (!reviewLink) {
    throw new Error("Review link was not found on dashboard");
  }

  const reviewUrl = new URL(reviewLink, "http://localhost:3000").toString();
  await page.goto(reviewUrl, { waitUntil: "networkidle" });
  await page.getByLabel("5 stars").click();
  await page.fill(
    'textarea[name="comment"]',
    "Everything was fast, helpful, and clear during the test interaction."
  );
  await page.fill('input[name="contact"]', email);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/thanks", { timeout: 30000 });

  await browser.close();
  console.log(`SMOKE_OK ${email}`);
}

main().catch(async (error) => {
  console.log(`SMOKE_ERROR ${error.name || "Error"} ${String(error.message).slice(0, 500)}`);
  process.exit(1);
});
