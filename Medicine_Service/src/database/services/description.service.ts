import Description from "../models/Description.model";

export default class dbService_Description {
  constructor() {}

  async getDescriptionById(id: number) {
    return await Description.findByPk(id);
  }

  async createDescription(_newDescription: Partial<Description>) {
    return await Description.create(_newDescription);
  }
}
