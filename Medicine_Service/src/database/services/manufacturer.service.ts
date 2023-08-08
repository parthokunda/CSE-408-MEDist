import { Op } from "sequelize";
import Manufacturer, {
  ManufacturerAttributes,
} from "../models/Manufacturer.model";
import { BrandInfo, SearchBrandOutput } from "./brand.service";
import createHttpError from "http-errors";

export interface AllManufacturerInfo {
  Manufacturer: ManufacturerAttributes;
  availableBrands: number;
}

export interface SingleManufacturerInfo {
  Manufacturer: ManufacturerAttributes;
  availableBrands: SearchBrandOutput;
}

interface ManufacturerInterface {
  getManufacturerByName(_name: string): Promise<Manufacturer>; // this is used in webScrapping

  getManufacturerById(id: number): Promise<Manufacturer>; // this is used in webScrapping

  createManufacturer( // this is used in webScrapping
    _newManufacturer: Partial<Manufacturer>
  ): Promise<Manufacturer>;

  getAllManufacturers(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<AllManufacturerInfo[]>;

  getSingleManufacturerInfo(id: number): Promise<SingleManufacturerInfo>;
}

export default class dbService_Manufacturer implements ManufacturerInterface {
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

  async getAllManufacturers(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<AllManufacturerInfo[]> {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    let manufacturers: Manufacturer[];

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      manufacturers = await Manufacturer.findAll({
        offset,
        limit: itemsPerPage,
      });
    } else {
      manufacturers = await Manufacturer.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `${searchBy}%`, // case insensitive starts with search
              },
            },
            {
              name: {
                [Op.iLike]: `%${searchBy}%`, // case insensitive contains search
              },
            },
          ],
        },
        offset,
        limit: itemsPerPage,
      });
    }

    const allManufacturerInfo = manufacturers.map(async (manufacturer) => {
      const availableBrands = await manufacturer.countBrands();
      return {
        Manufacturer: manufacturer.dataValues,
        availableBrands,
      };
    });

    return await Promise.all(allManufacturerInfo);
  }

  async getSingleManufacturerInfo(id: number): Promise<SingleManufacturerInfo> {
    const manufacturer = await Manufacturer.findByPk(id);

    if (manufacturer === null)
      throw new createHttpError.NotFound("Manufacturer not found");

    const brands = await manufacturer.getBrands();
    const totalCount = await manufacturer.countBrands();

    const brandInfos = brands.map(async (brand) => {
      const dosageForm = await brand.getDosageForm();
      const generic = await brand.getGeneric();

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
      Manufacturer: manufacturer.dataValues,
      availableBrands: {
        brandInfos: await Promise.all(brandInfos),
        totalCount,
      },
    };
  }
}
