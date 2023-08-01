//external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";

// type : brandOverview
export interface BrandOverview {
  dosageForm: {
    name: string;
    img_url: string;
  };
  brandName: string;
  strength: string;
  genericName: string;
  manufacturer: string;
  brandLink: string;
}

const BrandOverviews: BrandOverview[] = [];

const extractOverviews_ofAllBrands_FromAllBrandsPage = async (
  page: Page,
  pageNo: number
) => {
  // wait for page to load
  await page.waitForSelector(".hoverable-block");
  log.info(`All Brand Names Page ${pageNo} loaded`);

  // get all the brand overviews shown on the page
  const brandOverviewResults = await page.$$eval(
    ".hoverable-block",
    (brandElements) => {
      // select one by one brand shown on the page
      return brandElements.map((brandElement) => {
        let single_brandOverview: BrandOverview = {
          dosageForm: {
            name: "",
            img_url: "",
          },
          brandName: "",
          strength: "",
          genericName: "",
          manufacturer: "",
          brandLink: "",
        };

        // extract dosage form & its image url
        const dosageFormElement = brandElement.querySelector("img");

        single_brandOverview.dosageForm.name =
          dosageFormElement?.getAttribute("title") || "";

        single_brandOverview.dosageForm.img_url =
          dosageFormElement?.getAttribute("src") || "";

        // extract brand name
        const brandNameElement = brandElement.querySelector(".data-row-top");

        single_brandOverview.brandName =
          brandNameElement?.textContent.trim() || "";

        // extract strength
        const strengthElement = brandElement.querySelector(
          ".data-row-strength span"
        );

        single_brandOverview.strength =
          strengthElement?.textContent.trim() || "";

        // extract generic name
        const genericNameElement = brandElement.querySelector(
          ".col-xs-12:nth-child(3)"
        );

        single_brandOverview.genericName =
          genericNameElement?.textContent.trim() || "";

        // extract manufacturer
        const manufacturerElement =
          brandElement.querySelector(".data-row-company");

        single_brandOverview.manufacturer =
          manufacturerElement?.textContent.trim() || "";

        // extract brand link
        single_brandOverview.brandLink =
          brandElement.getAttribute("href") || "";

        return single_brandOverview;
      });
    }
  );

  // now we have all the brand overviews
  BrandOverviews.push(...brandOverviewResults);

  log.info(BrandOverviews, "Brand overviews extracted");

  return BrandOverviews;
};

export default extractOverviews_ofAllBrands_FromAllBrandsPage;
