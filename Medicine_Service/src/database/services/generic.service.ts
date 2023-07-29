import Generic from "../models/Generic.model";

export default class dbService_Generic {
  constructor() {}

  async getGenericByName(_name: string) {
    return await Generic.findOne({
      where: {
        name: _name,
      },
    });
  }

  async getGenericById(id: number) {
    return await Generic.findByPk(id);
  }

  async createGeneric(_newGeneric: Partial<Generic>) {
    return await Generic.create(_newGeneric);
  }
}
