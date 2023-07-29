import DosageForm from "../models/DosageForm.model";

export default class dbService_DosageForm {
  constructor() {}

    
    async checkExistenceByName(_name: string) : Promise<DosageForm> { 
        const dosageForm = await this.getDosageFormByName(_name);

        return dosageForm ? dosageForm : null;

    }
  async getDosageFormByName(_name: string) {
    return await DosageForm.findOne({
      where: {
        name: _name,
      },
    });
  }

  async getDosageFormById(id: number) {
    return await DosageForm.findByPk(id);
  }

  async createDosageForm(_newDosageForm: Partial<DosageForm>) {
    return await DosageForm.create(_newDosageForm);
  }
}
