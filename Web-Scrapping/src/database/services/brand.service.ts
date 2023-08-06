import Brand from "../models/Brand.model";

export default class dbService_Brand {
  constructor() {}

  async getBrandById(id: number) {
    return await Brand.findByPk(id);
  }

  async getBrandByName_and_Strength_and_DosageName(
    _name: string,
    _strength: string,
    _dosageFormName: string
  ) {
    const brands = await Brand.findAll({
      where: {
        name: _name,
        strength: _strength,
      },
    });

    for (let i = 0; i < brands.length; i++) {
      const brand = brands[i];

      const dosageForm = await brand.getDosageForm();

      if (dosageForm.name === _dosageFormName) {
        return brand;
      }
    }

    return null;
  }

  async getBrandByName_and_Strength_and_DosageID(
    _name: string,
    _strength: string,
    _dosageFormId: number
  ) {
    return await Brand.findOne({
      where: {
        name: _name,
        strength: _strength,
        dosageFormID: _dosageFormId,
      },
    });
  }

  async createBrand(_newBrand: Partial<Brand>) {
    return await Brand.create(_newBrand);
  }
}
