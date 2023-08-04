import { Op } from "sequelize";
import Brand from "../models/Brand.model";
import log from "../../utils/logger";
import Description, {
  DescriptionAttributes,
} from "database/models/Description.model";
import { DosageFormAttributes } from "database/models/DosageForm.model";
import { GenericAttributes } from "database/models/Generic.model";
import { ManufacturerAttributes } from "database/models/Manufacturer.model";

export interface BrandInfo {
  Brand: {
    id: number;
    name: string;
    strength: string;
  };
  DosageForm: DosageFormAttributes;
  Generic: GenericAttributes;
  Manufacturer: ManufacturerAttributes;
}

export interface BrandDescription extends BrandInfo {
  Description: DescriptionAttributes;
}

interface Brand_Service_Interface {
  getBrandById(id: number): Promise<BrandDescription>;

  getBrandByName(_name: string): Promise<Brand>; // this is used in webScrapping

  createBrand(_newBrand: Partial<Brand>): Promise<Brand>; // this is used in webScrapping

  getAllBrands(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<BrandInfo[]>;
}

export default class dbService_Brand implements Brand_Service_Interface {
  constructor() {}

  async getBrandById(id: number): Promise<BrandDescription> {
    const brand = await Brand.findByPk(id);
    if (brand === null) {
      log.error(`Brand with id ${id} not found`);
      return null;
    }

    const dosageForm = await brand.getDosageForm();
    const generic = await brand.getGeneric();
    const manufacturer = await brand.getManufacturer();
    const details = await brand.getDescription();

    const brandDescription: BrandDescription = {
      Brand: {
        id: brand.id,
        name: brand.name,
        strength: brand.strength,
      },
      DosageForm: dosageForm.dataValues,
      Generic: generic.dataValues,
      Manufacturer: manufacturer.dataValues,
      Description: details.dataValues,
    };

    return brandDescription;
  }

  async getBrandByName(_name: string) {
    return await Brand.findOne({
      where: {
        name: _name,
      },
    });
  }

  async createBrand(_newBrand: Partial<Brand>) {
    return await Brand.create(_newBrand);
  }

  async getAllBrands(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<BrandInfo[]> {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    let brands: Brand[];

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      brands = await Brand.findAll({
        offset,
        limit: itemsPerPage,
      });
    } else {
      brands = await Brand.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchBy}%`,
          },
        },
        offset,
        limit: itemsPerPage,
      });
    }

    // populating the brands
    const brandInfos = brands.map(async (brand) => {
      const dosageForm = await brand.getDosageForm();
      const generic = await brand.getGeneric();
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

    return await Promise.all(brandInfos);
  }
}
