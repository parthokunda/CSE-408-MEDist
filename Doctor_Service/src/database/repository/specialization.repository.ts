//import models
import createHttpError from "http-errors";
import { Specialization } from "../models";

export interface Specialization_Repository_Interface {
  getAllSpecializations(): Promise<Specialization[]>;
  getSpecialization(specializationID: number): Promise<Specialization>;

  searchSpecialization(specializationName: string): Promise<Specialization[]>;
}

class SpecializationRepository implements Specialization_Repository_Interface {
  // ----------------- get all specializations -----------------
  async getAllSpecializations(): Promise<Specialization[]> {
    const specializations = await Specialization.findAll();
    if (!specializations)
      throw createHttpError.NotFound("Specializations not found");
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
