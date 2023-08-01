//external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";
import extractDetails_ofCurrentBrand from "./extracDetails_ofCurrentBrand";
import { entryToDB_BrandDetails } from "./databaseEntry";

const extractDetails_ofAllBrands_fromCurrentAllBrandsPage = async (
  page: Page,
  curr_brandOverviews: BrandOverview[]
) => {
  for (let i = 0; i < curr_brandOverviews.length; i++) {
    const curr_brandOveriew = curr_brandOverviews[i];

    // go to the link of the brand
    await page.goto(curr_brandOveriew.brandLink);
    log.info(`Page loaded successfully for ${curr_brandOveriew.brandName}`);

    //extract details of the brand
    const brandDetails = await extractDetails_ofCurrentBrand(page);

    log.info(
      `Details extracted successfully for ${curr_brandOveriew.brandName}`
    );

    // back to the previous page
    await page.goBack();
    log.info(`Back to the previous page`);

    // data entry to the database
    await entryToDB_BrandDetails(curr_brandOveriew.brandName, brandDetails);
  }
};

export default extractDetails_ofAllBrands_fromCurrentAllBrandsPage;
