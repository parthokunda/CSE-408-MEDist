//external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";

const extractDetails_ofAllBrands_fromCurrentAllBrandsPage = async (
  page: Page,
  curr_brandOverviews: BrandOverview[]
) => {};

export default extractDetails_ofAllBrands_fromCurrentAllBrandsPage;
