//external imports
import puppeteer, { Page } from "puppeteer";

// internal imports
import log from "../../utils/logger";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";

interface AvailableForms {
  dosageForm: string;
  strength: string;
  unitPrice: string;
}

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
  availableForms: AvailableForms[];
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
    availableForms: [],
  };
};

const extractDetails_ofCurrentBrand = async (page: Page) => {
  // Wait for the page to load
  await page.waitForSelector(".package-container");

  let brandDetails: BrandDetails = createEmptyBrandDescriptionInfo();

  // Extract unit price
  brandDetails.unitPrice = await page.$$eval(
    ".package-container span:not(:first-child)",
    (spans) => {
      let unitPrice = "";

      spans.forEach((span) => {
        unitPrice += span.textContent?.trim() || "";
      });

      return unitPrice;
    }
  ) || "";

  // Extract indications
  brandDetails.indications = await page.$eval(
    "#indications + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract compositions
  brandDetails.compositions = await page.$eval(
    "#composition + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract pharmacology
  brandDetails.pharmacology = await page.$eval(
    "#mode_of_action + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract dosage and administration
  brandDetails.dosage_and_administration = await page.$eval(
    "#dosage + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract interaction
  brandDetails.interaction = await page.$eval(
    "#interaction + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract contraindications
  brandDetails.contraindications = await page.$eval(
    "#contraindications + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract side effects
  brandDetails.sideEffects = await page.$eval(
    "#side_effects + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract pregnancy and lactation
  brandDetails.pregnancy_and_lactation = await page.$eval(
    "#pregnancy_cat + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract precautions and warning
  brandDetails.precautions_and_warning = await page.$eval(
    "#precautions + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract overdose effects
  brandDetails.overdose_effects = await page.$eval(
    "#overdose_effects + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract therapeutic class
  brandDetails.therapeuticClass = await page.$eval(
    "#drug_classes + .ac-body",
    (element) => element.textContent.trim()
  ) || "";

  // Extract storage conditions
  brandDetails.storage_conditions = await page.$eval(
    "#storage_conditions + .ac-body",
    (element) => element.textContent.trim()
  ) || "";
};

export default extractDetails_ofCurrentBrand;
