import { Page } from "puppeteer";

import log from "../../utils/logger";
import { entryToDB_GenericDetails } from "./databaseEntry";

export interface GenericDetails {
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

const createEmptyGenericDescriptionInfo = (): GenericDetails => {
  return {
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
const extractGenericDetails_ofCurrentBrand = async (page: Page) => {
  //clicking the generic name link
  await page.click('div[title="Generic Name"] a');

  log.info("Clicked on the generic name link and we are on the generic page");

  // Wait for the page to load
  await page.waitForSelector(".ac-body");

  let genericDetails: GenericDetails = createEmptyGenericDescriptionInfo();

  // Extract indications
  if (await page.$("#indications + .ac-body")) {
    genericDetails.indications = await page.$eval(
      "#indications + .ac-body",
      (div) => div.textContent.trim()
    );
  }

  // Extract compositions
  if (await page.$("#composition + .ac-body")) {
    genericDetails.compositions = await page.$eval(
      "#composition + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract pharmacology
  if (await page.$("#mode_of_action + .ac-body")) {
    genericDetails.pharmacology = await page.$eval(
      "#mode_of_action + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract dosage and administration
  if (await page.$("#dosage + .ac-body")) {
    genericDetails.dosage_and_administration = await page.$eval(
      "#dosage + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract interaction
  if (await page.$("#interaction + .ac-body")) {
    genericDetails.interaction = await page.$eval(
      "#interaction + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract contraindications
  if (await page.$("#contraindications + .ac-body")) {
    genericDetails.contraindications = await page.$eval(
      "#contraindications + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract side effects
  if (await page.$("#side_effects + .ac-body")) {
    genericDetails.sideEffects = await page.$eval(
      "#side_effects + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract pregnancy and lactation
  if (await page.$("#pregnancy_cat + .ac-body")) {
    genericDetails.pregnancy_and_lactation = await page.$eval(
      "#pregnancy_cat + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract interaction
  if (await page.$("#interaction + .ac-body")) {
    genericDetails.interaction = await page.$eval(
      "#interaction + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract contraindications
  if (await page.$("#contraindications + .ac-body")) {
    genericDetails.contraindications = await page.$eval(
      "#contraindications + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract side effects
  if (await page.$("#side_effects + .ac-body")) {
    genericDetails.sideEffects = await page.$eval(
      "#side_effects + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract pregnancy and lactation
  if (await page.$("#pregnancy_cat + .ac-body")) {
    genericDetails.pregnancy_and_lactation = await page.$eval(
      "#pregnancy_cat + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract precautions and warning
  if (await page.$("#precautions + .ac-body")) {
    genericDetails.precautions_and_warning = await page.$eval(
      "#precautions + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract overdose effects
  if (await page.$("#overdose_effects + .ac-body")) {
    genericDetails.overdose_effects = await page.$eval(
      "#overdose_effects + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract therapeutic class
  if (await page.$("#drug_classes + .ac-body")) {
    genericDetails.therapeuticClass = await page.$eval(
      "#drug_classes + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  // Extract storage conditions
  if (await page.$("#storage_conditions + .ac-body")) {
    genericDetails.storage_conditions = await page.$eval(
      "#storage_conditions + .ac-body",
      (element) => element.textContent.trim()
    );
  }

  const genericName = await page.$eval(".page-heading-1-l", (h1) =>
    h1.textContent.trim()
  );

  log.info(`generic details of ${genericName} extracted successfully`);
  //log.info(genericDetails);

  // entry to the database
  //await entryToDB_GenericDetails(genericName, genericDetails);
  //log.info(`generic details of ${genericName} inserted into the database`);

  // Go back to the previous page
  await page.goBack();

  return page;
};

export default extractGenericDetails_ofCurrentBrand;
