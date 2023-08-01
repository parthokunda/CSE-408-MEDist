//import all models

import Description from "../models/Description.model";
import dbService_Generic from "./generic.service";
import dbService_Brand from "./brand.service";
import dbService_DosageForm from "./dosage.service";
import dbService_Manufacturer from "./manufacturer.service";
import dbService_Description from "./description.service";

export default class dbService {
  genericService: dbService_Generic;
  brandService: dbService_Brand;
  dosageService: dbService_DosageForm;
  manufacturerService: dbService_Manufacturer;
  descriptionService: dbService_Description;

  constructor() {
    /* Generic Model Service  */
    this.genericService = new dbService_Generic();

    /* Brand Model Service */
    this.brandService = new dbService_Brand();

    /* Dosage Model Service */
    this.dosageService = new dbService_DosageForm();

    /* Manufacturer Model Service */
    this.manufacturerService = new dbService_Manufacturer();

    /* Description Model Service */
    this.descriptionService = new dbService_Description();
  }
}
