import { Op } from "sequelize";
import Generic, { GenericAttributes } from "../models/Generic.model";

interface GenericInfo {
  Generic: GenericAttributes;
  availableBrands: number;
}

interface GenericInterface {
  getGenericByName(_name: string): Promise<Generic | null>; // this is used in webScrapping
  getGenericById(id: number): Promise<Generic | null>; // this is used in webScrapping
  createGeneric(_newGeneric: Partial<Generic>): Promise<Generic>; // this is used in webScrapping

  getAllGenerics(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<GenericInfo[]>;
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
  ): Promise<GenericInfo[]> {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    let generics: Generic[];

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      // Fetch all brands without any search criteria
      generics = await Generic.findAll({
        offset,
        limit: itemsPerPage,
      });
    } else {
      // Fetch all brands with search criteria
      generics = await Generic.findAll({
        where: {
          name: {
            [Op.like]: `%${searchBy}%`,
          },
        },
        offset,
        limit: itemsPerPage,
      });
    }

    // Get the total number of brands
    const genericInfos = generics.map(async (generic) => {
      const availableBrands = await generic.countBrands();
      return {
        Generic: generic.dataValues,
        availableBrands,
      };
    });

    return await Promise.all(genericInfos);
  }
}
