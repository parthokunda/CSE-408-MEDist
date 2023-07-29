import Brand from "../models/Brand.model";

export default class dbService_Brand {
  constructor() {}

  async getBrandById(id: number) {
    return await Brand.findByPk(id);
  }

  async getBrandByName(_name: string) {
    return await Brand.findOne({
      where: {
        name: _name,
      },
    });
  }

  async createBrand(_newBrand: Partial<Brand>) {
    return await Brand.create(_newBrand);
  }
}
