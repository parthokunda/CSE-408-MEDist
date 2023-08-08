import { Op } from "sequelize";
import Brand from "../models/Brand.model";
import log from "../../utils/logger";
import Description, {
  DescriptionAttributes,
} from "database/models/Description.model";
import { DosageFormAttributes } from "database/models/DosageForm.model";
import { GenericAttributes } from "database/models/Generic.model";
import { ManufacturerAttributes } from "database/models/Manufacturer.model";

export interface SearchBrandOutput {
  brandInfos: BrandInfo[];
  totalCount: number;
}

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

const createEmptyBrandDescriptionInfo = (): DescriptionAttributes => {
  return {
    id: 0,
    unit_price: "",
    indications: "",
    compositions: "",
    pharmacology: "",
    dosage_and_administration: "",
    interaction: "",
    contraindications: "",
    side_effects: "",
    pregnancy_and_lactation: "",
    precautions_and_warnings: "",
    overdose_effects: "",
    therapeutic_class: "",
    storage_conditions: "",
  };
};
interface Brand_Service_Interface {
  getBrandById(id: number): Promise<BrandDescription>;

  getBrandByName(_name: string): Promise<Brand>; // this is used in webScrapping

  createBrand(_newBrand: Partial<Brand>): Promise<Brand>; // this is used in webScrapping

  getAllBrands(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<SearchBrandOutput>;
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
      Description: details
        ? details.dataValues
        : createEmptyBrandDescriptionInfo(),
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
  ): Promise<SearchBrandOutput> {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    let brands: Brand[];
    let totalCount: number;

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      brands = await Brand.findAll({
        offset,
        limit: itemsPerPage,
      });

      // Get the total number of brands
      totalCount = await Brand.count();
    } else {
      brands = await Brand.findAll({
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

      // Get the total number of brands without limit and offset
      totalCount = await Brand.count({
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

    // return in the form of {brandInfos: [], totalCount: number}
    return {
      brandInfos: await Promise.all(brandInfos),
      totalCount,
    };
  }
}
