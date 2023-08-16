//import models
import Specialization from "../models/Specialization.model";
import Doctor from "../models/Doctor.model";

export interface Specialization_Repository_Interface {
  addNewSpecialization(specializationName: string): Promise<Specialization>;
  updateSpecialization(
    specializationID: number,
    specializationName: string
  ): Promise<Specialization>;
  deleteSpecialization(specializationID: number): Promise<void>;
  getAllSpecializations(): Promise<Specialization[]>;
  getSpecialization(specializationID: number): Promise<Specialization>;

  searchSpecialization(specializationName: string): Promise<Specialization[]>;
}

class SpecializationRepository implements Specialization_Repository_Interface {
  // ---------------- add new specialization ----------------
  async addNewSpecialization(
    specializationName: string
  ): Promise<Specialization> {
    const exist = await Specialization.findOne({
      where: {
        name: specializationName,
      },
    });

    if (exist) {
      throw new Error("Specialization already exists");
    }
    const newSpecialization = await Specialization.create({
      name: specializationName,
    });

    return newSpecialization;
  }

  // ---------------- update specialization ----------------
  async updateSpecialization(
    specializationID: number,
    specializationName: string
  ): Promise<Specialization> {
    const specialization = await Specialization.findByPk(specializationID);
    if (!specialization) {
      throw new Error("Specialization not found");
    }

    specialization.name = specializationName;
    await specialization.save();

    return specialization;
  }

  // ----------------- delete specialization -----------------
  async deleteSpecialization(specializationID: number): Promise<void> {
    const specialization = await Specialization.findByPk(specializationID);
    if (!specialization) throw new Error("Specialization not found");

    await specialization.destroy();
  }

  // ----------------- get all specializations -----------------
  async getAllSpecializations(): Promise<Specialization[]> {
    const specializations = await Specialization.findAll();
    return specializations;
  }

  // ----------------- get specialization -----------------
  async getSpecialization(specializationID: number): Promise<Specialization> {
    const specialization = await Specialization.findByPk(specializationID);
    if (!specialization) throw new Error("Specialization not found");

    return specialization;
  }

  // ----------------- search specialization -----------------
  async searchSpecialization(
    specializationName: string
  ): Promise<Specialization[]> {
    const specializations = await Specialization.findAll({
      where: {
        name: specializationName,
      },
    });

    return specializations;
  }
}

export default new SpecializationRepository();
