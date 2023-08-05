//external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";

const selectBrandNameOption_FromDropdown = async (page: Page) => {
  //hover over the brand name menu
  const brandNameDropdown = await page.$(".navigation__dropdown");
  await brandNameDropdown.hover();

  // wait for style to change to from display: none >> display: block
  await page.waitForFunction(() => {
    const dropMenu = document.querySelector(".navigation__drop-menu");
    const computedStyle = window.getComputedStyle(dropMenu);
    return computedStyle.getPropertyValue("display") === "block";
  });

  // wait for dropdown menu to load
  await page.waitForSelector("#nav-menu-brands");

  // select "Brand Names (Allopathic)"
  /* const brandNamesAllopathicLink = await page.$("#nav-menu-brands a");
  await brandNamesAllopathicLink.click(); */

  await page.click("#nav-menu-brands a");

  // wait for page navigation
  //await page.waitForNavigation();

  await page.screenshot({ path: "example.png" });

  return page;
};

export default selectBrandNameOption_FromDropdown;
