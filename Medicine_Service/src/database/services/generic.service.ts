import { Op } from "sequelize";
import Generic from "../models/Generic.model";

interface GenericInterface {
  getGenericByName(_name: string): Promise<Generic | null>;
  getGenericById(id: number): Promise<Generic | null>;
  createGeneric(_newGeneric: Partial<Generic>): Promise<Generic>;
  getAllGenerics(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<Generic[]>;
}

export default class dbService_Generic implements GenericInterface {
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

  async getAllGenerics(
    searchBy: string,
    pagination: number,
    currentPage: number
  ) {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      // Fetch all brands without any search criteria
      return await Generic.findAll({
        offset,
        limit: itemsPerPage,
      });
    } else {
      // Fetch all brands with search criteria
      return await Generic.findAll({
        where: {
          name: {
            [Op.like]: `%${searchBy}%`,
          },
        },
        offset,
        limit: itemsPerPage,
      });
    }
  }
}
