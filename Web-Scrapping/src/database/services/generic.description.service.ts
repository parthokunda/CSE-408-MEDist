import Generic_Description from "../models/Generic.Description.model";

export default class dbService_Generic_Description {
  constructor() {}

  async getDescriptionById(id: number) {
    return await Generic_Description.findByPk(id);
  }

  async createDescription(_newDescription: Partial<Generic_Description>) {
    return await Generic_Description.create(_newDescription);
  }
}
