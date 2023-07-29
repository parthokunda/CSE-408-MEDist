//external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";

export interface BrandDetails {
  unitPrice: string;
  indications: string;
  compositions: string;
  pharmacology: string;
  dosage_and_administration: string;
  interaction: string;
  contraindications: string;
  sideEffects: string;
  pregnancy_and_lactation: string;
  precautions_and_warning: string;
  overdose_effects: string;
  therapeuticClass: string;
  storage_conditions: string;
}

const createEmptyBrandDescriptionInfo = (): BrandDetails => {
  return {
    unitPrice: "",
    indications: "",
    compositions: "",
    pharmacology: "",
    dosage_and_administration: "",
    interaction: "",
    contraindications: "",
    sideEffects: "",
    pregnancy_and_lactation: "",
    precautions_and_warning: "",
    overdose_effects: "",
    therapeuticClass: "",
    storage_conditions: "",
  };
};

const extractDetails_ofCurrentBrand = async (page: Page) => {
  // Wait for the page to load
  await page.waitForSelector(".package-container");

  let brandDetails: BrandDetails = createEmptyBrandDescriptionInfo();

  // Extract unit price
  if (await page.$(".package-container")) {
    brandDetails.unitPrice = await page.$$eval(
      ".package-container span:not(:first-child)",
      (spans) => {
        let unitPrice = "";

        spans.forEach((span) => {
          unitPrice += span.textContent?.trim();
        });

        return unitPrice;
      }
    );
  }

  // Extract indications
  if (await page.$("#indications + .ac-body")) {
    brandDetails.indications = await page.$eval(
      "#indications + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract compositions
  if (await page.$("#composition + .ac-body")) {
    brandDetails.compositions = await page.$eval(
      "#composition + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract pharmacology
  if (await page.$("#mode_of_action + .ac-body")) {
    brandDetails.pharmacology = await page.$eval(
      "#mode_of_action + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract dosage and administration
  if (await page.$("#dosage + .ac-body")) {
    brandDetails.dosage_and_administration = await page.$eval(
      "#dosage + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract interaction
  if (await page.$("#interaction + .ac-body")) {
    brandDetails.interaction = await page.$eval(
      "#interaction + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract contraindications
  if (await page.$("#contraindications + .ac-body")) {
    brandDetails.contraindications = await page.$eval(
      "#contraindications + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract side effects
  if (await page.$("#side_effects + .ac-body")) {
    brandDetails.sideEffects = await page.$eval(
      "#side_effects + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract pregnancy and lactation
  if (await page.$("#pregnancy_cat + .ac-body")) {
    brandDetails.pregnancy_and_lactation = await page.$eval(
      "#pregnancy_cat + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract precautions and warning
  if (await page.$("#precautions + .ac-body")) {
    brandDetails.precautions_and_warning = await page.$eval(
      "#precautions + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract overdose effects
  if (await page.$("#overdose_effects + .ac-body")) {
    brandDetails.overdose_effects = await page.$eval(
      "#overdose_effects + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract therapeutic class
  if (await page.$("#drug_classes + .ac-body")) {
    brandDetails.therapeuticClass = await page.$eval(
      "#drug_classes + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract storage conditions
  if (await page.$("#storage_conditions + .ac-body")) {
    brandDetails.storage_conditions = await page.$eval(
      "#storage_conditions + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  return brandDetails;
};

export default extractDetails_ofCurrentBrand;
