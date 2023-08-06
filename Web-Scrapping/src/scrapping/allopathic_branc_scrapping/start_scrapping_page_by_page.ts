// external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";
import { entryToDB_BrandOverviews } from "./databaseEntry";
import extractDetails_ofAllBrands_fromCurrentAllBrandsPage from "./extractDetails_ofAllBrands_fromCurrentAllBrandsPage";
import extractOverviews_OfAllBrands_FromAllBrandsPage from "./extractOverviews_ofAllBrands_FromAllBrandsPage";

const start_scrapping_page_by_page = async (
  startPage: number,
  endPage: number,
  isHeadless: boolean
) => {
  const browser = await puppeteer.launch({ headless: isHeadless });
  let page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1500 });

  try {
    for (let i = startPage; i <= endPage; i++) {
      await page.goto(`https://medex.com.bd/brands?page=${i}`);

      // get the brand overviews
      const brandOverviews: BrandOverview[] =
        await extractOverviews_OfAllBrands_FromAllBrandsPage(page, i);

      // entry those brand overviews to database
      //await entryToDB_BrandOverviews(brandOverviews);

      // get the brand details
      await extractDetails_ofAllBrands_fromCurrentAllBrandsPage(
        page,
        brandOverviews
      );
    }
  } catch (err) {
    log.error(err);
  } finally {
    await browser.close();
  }
};

export default start_scrapping_page_by_page;
