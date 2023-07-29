import Manufacturer from "../models/Manufacturer.model";

export default class dbService_Manufacturer {
  constructor() {}

  async getManufacturerByName(_name: string) {
    return await Manufacturer.findOne({
      where: {
        name: _name,
      },
    });
  }

  async getManufacturerById(id: number) {
    return await Manufacturer.findByPk(id);
  }

  async createManufacturer(_newManufacturer: Partial<Manufacturer>) {
    return await Manufacturer.create(_newManufacturer);
  }
}
