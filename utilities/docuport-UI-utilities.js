 import { test as base, expect } from "@playwright/test";    // Playwright's test (renamed base) + expect
import path from "path";                                    // build file paths — screenshots folder
import fs from "fs";                                        // create that folder on disk
import { appInfo } from "./beta-data-reader.js";            // data from beta_data.json
import { LoginPage } from "../pages/LoginPage.js";          // used by CommonUI (next slide)
import { HomePage } from "../pages/HomePage.js";            // used by CommonUI (next slide)

export const testBase = base.extend({                       // OUR testBase = Playwright's test + extras
  page: async ({ page }, use, testInfo) => {                 // replace the built-in page
    await page.goto(process.env.DOCUPORT_BASE_URL);         // ① BEFORE — open Docuport (.env.beta)
    await expect(page).toHaveTitle(appInfo.loginPageTitle); // ① check the title is "Docuport"
    await use(page);                                        // ② the test itself runs here
    await takeScreenshotIfFailed(page, testInfo);           // ③ AFTER — screenshot if it failed
  },
});





export { expect };

// REUSABLE METHODS — used by many tests
export class CommonUI {

  // Log in as any role and land on Home
  static async loginAs(page, role = "client") {
    await new LoginPage(page).loginAs(role);
    await new HomePage(page)
      .verifyHomePageFor(role);
  }

  // Profile icon → Log out
  static async logout(page) {
    await new HomePage(page).profileIconButton.click();
    await page.getByText("Log out").click();
    await new LoginPage(page).verifyLoginPageIsOpen();
  }

  // Expected left menu for a role, from beta_data.json
  static getLeftMenuFor(role) {
    return appInfo.leftMenu[role];
  }
}

// Screenshot only if the test failed
async function takeScreenshotIfFailed(page, testInfo) {
  if (testInfo.status !== "failed") return;

  const dir = path.join("screenshots");
  fs.mkdirSync(dir, { recursive: true });

  const time = new Date().toISOString()
    .replace(/[:T.]/g, "_").slice(0, -5);
  const safeTitle =
    testInfo.title.replace(/\s+/g, "_");
  const name = `${safeTitle}_failed_${time}.png`;

  await page.screenshot({
    path: path.join(dir, name),
    fullPage: true,
  });
}