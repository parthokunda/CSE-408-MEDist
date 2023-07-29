// external imports
import puppeteer from "puppeteer";

// internal imports
import log from "../../utils/logger";
import selectBrandNameOption_FromDropdown from "./selectBrandNameOption_FromDropdown";
import extractOverviews_OfAllBrands_FromAllBrandsPage, {
  BrandOverview,
} from "./extractOverviews_ofAllBrands_FromAllBrandsPage";
import { entryToDB_BrandOverviews } from "./databaseEntry";
import extractDetails_ofAllBrands_fromCurrentAllBrandsPage from "./extractDetails_ofAllBrands_fromCurrentAllBrandsPage";

const start_scrapping = async (isHeadless: boolean) => {
  const browser = await puppeteer.launch({ headless: isHeadless });
  let page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1500 });

  try {
    await page.goto("https://medex.com.bd/");
    log.info("Home page loaded");

    // select "Brand Names (Allopathic)" and navigate to the page
    page = await selectBrandNameOption_FromDropdown(page);

    /* ..... now we are on the page after selecting "Brand Names (Allopathic)" .... */

    // get overviews of all the brands shown on the page
    const brandOverviews: BrandOverview[] =
      await extractOverviews_OfAllBrands_FromAllBrandsPage(page, 1);

    await entryToDB_BrandOverviews(brandOverviews);

    // get the brand details
    await extractDetails_ofAllBrands_fromCurrentAllBrandsPage(
      page,
      brandOverviews
    );

    // select next page button
    let nextPageButton = await page.$(".page-link[rel='next']");
    let nextPageNum = 2;
    const maxPageNum = 2;

    while (nextPageButton && nextPageNum <= maxPageNum) {
      await nextPageButton.click();
      await page.waitForNavigation();

      const nextPageBrandOverviews: BrandOverview[] =
        await extractOverviews_OfAllBrands_FromAllBrandsPage(page, nextPageNum);

      await entryToDB_BrandOverviews(nextPageBrandOverviews);

      await extractDetails_ofAllBrands_fromCurrentAllBrandsPage(
        page,
        nextPageBrandOverviews
      );

      nextPageButton = await page.$(".page-link[rel='next']");
      nextPageNum++;
    }
  } catch (error) {
    log.error(error);
  } finally {
    await browser.close();
  }
};

export default start_scrapping;
