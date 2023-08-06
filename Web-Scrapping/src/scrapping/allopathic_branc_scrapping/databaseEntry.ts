//internal imports
import log from "../../utils/logger";
import dbService from "../../database/services/service";
import { BrandOverview } from "./extractOverviews_ofAllBrands_FromAllBrandsPage";

// import models
import Generic from "../../database/models/Generic.model";
import Brand from "../../database/models/Brand.model";
import DosageForm from "../../database/models/DosageForm.model";
import Manufacturer from "../../database/models/Manufacturer.model";
import { BrandDetails } from "./extractDetails_ofCurrentBrand";
import { GenericDetails } from "./extractGenericDetails_ofCurrentBrand";

const _dbService = new dbService();

export const entryToDB_BrandOverviews = async (
  brandOverviews: BrandOverview[]
) => {
  for (let i = 0; i < brandOverviews.length; i++) {
    const brandOverview = brandOverviews[i];

    let DosageForm = await _dbService.dosageService.getDosageFormByName(
      brandOverview.dosageForm.name.trim()
    );

    if (!DosageForm) {
      log.info(`Creating DosageForm: ${brandOverview.dosageForm}`);
      DosageForm = await _dbService.dosageService.createDosageForm({
        name: brandOverview.dosageForm.name.trim(),
        img_url: brandOverview.dosageForm.img_url || "",
      });

      log.info(`Created DosageForm: ${DosageForm.toJSON()}`);
    } else log.info(`DosageForm already exists: ${DosageForm.toJSON()}`);

    let Manufacturer =
      await _dbService.manufacturerService.getManufacturerByName(
        brandOverview.manufacturer.trim()
      );

    if (!Manufacturer) {
      log.info(`Creating Manufacturer: ${brandOverview.manufacturer}`);
      Manufacturer = await _dbService.manufacturerService.createManufacturer({
        name: brandOverview.manufacturer.trim(),
      });
      log.info(`Created Manufacturer: ${Manufacturer.toJSON()}`);
    } else log.info(`Manufacturer already exists: ${Manufacturer.toJSON()}`);

    let Generic = await _dbService.genericService.getGenericByName(
      brandOverview.genericName.trim()
    );

    if (!Generic) {
      log.info(`Creating Generic: ${brandOverview.genericName}`);
      Generic = await _dbService.genericService.createGeneric({
        name: brandOverview.genericName.trim(),
        type: "Allopathic",
      });
      log.info(`Created Generic: ${Generic.toJSON()}`);
    } else log.info(`Generic already exists: ${Generic.toJSON()}`);

    let Brand =
      await _dbService.brandService.getBrandByName_and_Strength_and_DosageName(
        brandOverview.brandName,
        brandOverview.strength,
        brandOverview.dosageForm.name
      );

    if (!Brand) {
      log.info(`Creating Brand: ${brandOverview.brandName}`);

      Brand = await _dbService.brandService.createBrand({
        name: brandOverview.brandName,
        strength: brandOverview.strength,
        description_url: brandOverview.brandLink,
        genericID: Generic.id,
        dosageFormID: DosageForm.id,
        manufacturerID: Manufacturer.id,
      });

      Brand.setGeneric(Generic);
      Brand.setDosageForm(DosageForm);
      Brand.setManufacturer(Manufacturer);

      Generic.addBrand(Brand);
      DosageForm.addBrand(Brand);
      Manufacturer.addBrand(Brand);

      log.info(`Created Brand: ${Brand.toJSON()}`);
    } else log.info(`Brand already exists: ${Brand.toJSON()}`);
  }

  log.info(
    "All Brand Overviews of current page are inserted into the database"
  );
};

export const entryToDB_BrandDetails = async (
  brandName: string,
  brandStrength: string,
  dosageFormName: string,
  brandDetails: BrandDetails
) => {
  const brand =
    await _dbService.brandService.getBrandByName_and_Strength_and_DosageName(
      brandName,
      brandStrength,
      dosageFormName
    );
  log.info(`Creating Description for Brand: ${brand.toJSON()}`);

  if (brand.descriptionID) {
    log.info(`Description already exists for Brand: ${brand.toJSON()}`);
    return;
  }

  const Description = await _dbService.descriptionService.createDescription({
    ...brandDetails,
  });
  log.info(
    `Created Description: ${Description.toJSON()} ---- for Brand: ${brand.toJSON()}`
  );

  brand.descriptionID = Description.id;
  brand.unit_price = brandDetails.unit_price;
  brand.setDescription(Description);

  await brand.save();
  log.info(`Description_ID Updated in Brand: ${brand.toJSON()}`);
};

export const entryToDB_GenericDetails = async (
  genericName: string,
  genericDetails: GenericDetails
) => {
  const generic = await _dbService.genericService.getGenericByName(genericName);
  log.info(`Creating Description for Generic: ${generic.name}`);

  if (generic.descriptionID) {
    log.info(`Description already exists for Generic: ${generic.name}`);
    return;
  }

  const Description =
    await _dbService.genericDescriptionService.createDescription({
      ...genericDetails,
    });

  log.info(
    `Created Description: ${Description.toJSON()} ---- for Generic: ${
      generic.name
    }`
  );

  generic.descriptionID = Description.id;
  generic.setDescription(Description);

  await generic.save();
  log.info(`Description_ID Updated in Generic: ${generic.name}`);
};
