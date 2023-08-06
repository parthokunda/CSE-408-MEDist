import { Op } from "sequelize";
import Generic, { GenericAttributes } from "../models/Generic.model";
import { BrandInfo } from "./brand.service";
import createHttpError from "http-errors";
import { GenericDescriptionAttributes } from "database/models/Generic.Description.model";

export interface AllGenericInfo {
  Generic: GenericAttributes;
  availableBrands: number;
}

export interface SingleGenericInfo {
  Generic: GenericAttributes;
  Description: GenericDescriptionAttributes;
  availableBrands: BrandInfo[];
}

interface GenericInterface {
  getGenericByName(_name: string): Promise<Generic | null>; // this is used in webScrapping
  getGenericById(id: number): Promise<Generic | null>; // this is used in webScrapping
  createGeneric(_newGeneric: Partial<Generic>): Promise<Generic>; // this is used in webScrapping

  getAllGenericInfos(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<AllGenericInfo[]>;

  getSingleGenericInfo(id: number): Promise<SingleGenericInfo>;
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

  async getAllGenericInfos(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<AllGenericInfo[]> {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    let generics: Generic[];

    try {
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
    catch (error) {
      throw error;
    }
  }

  // when we click on a generic, we want to see all the brands that are available for that generic
  async getSingleGenericInfo(id: number): Promise<SingleGenericInfo> {
    try {
      const generic = await Generic.findByPk(id);

      if (!generic) throw new createHttpError.NotFound("Generic not found");

      // get generic description
      const description = await generic.getDescription();

      // get all brands for this generic
      const brands = await generic.getBrands();

      const brandInfos = brands.map(async (brand) => {
        const dosageForm = await brand.getDosageForm();
        const manufacturer = await brand.getManufacturer();

        return {
          Brand: {
            id: brand.id,
            name: brand.name,
            strength: brand.strength,
          },
          DosageForm: dosageForm.dataValues,
          Generic: generic.dataValues,
          Manufacturer: manufacturer.dataValues,
        };
      });

      return {
        Generic: generic.dataValues,
        Description: description.dataValues,
        availableBrands: await Promise.all(brandInfos),
      };
    } catch (error) {
      throw error;
    }
  }
}
