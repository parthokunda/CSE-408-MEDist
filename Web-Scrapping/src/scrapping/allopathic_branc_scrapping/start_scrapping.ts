// external imports
import puppeteer from "puppeteer";

// internal imports
import log from "../../utils/logger";
import selectBrandNameOption_FromDropdown from "./selectBrandNameOption_FromDropdown";
import extractOverviews_OfAllBrands_FromAllBrandsPage, {
  BrandOverview,
} from "./extractOverviews_ofAllBrands_FromAllBrandsPage";
import { entryToDB_BrandOverviews } from "./databaseEntry";

const start_scrapping = async (isHeadless: boolean) => {
  const browser = await puppeteer.launch({ headless: isHeadless });
  let page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1500 });

  try {
    await page.goto("https://medex.com.bd/");
    log.info("Home page loaded");

    // select "Brand Names (Allopathic)" and navigate to the page
    page = await selectBrandNameOption_FromDropdown(page);

    // now we are on the page after selecting "Brand Names (Allopathic)"

    // get overviews of all the brands shown on the page
    const brandOverviews: BrandOverview[] =
      await extractOverviews_OfAllBrands_FromAllBrandsPage(page, 1);

    await entryToDB_BrandOverviews(brandOverviews);
  } catch (error) {
    log.error(error);
  } finally {
    await browser.close();
  }
};

export default start_scrapping;
