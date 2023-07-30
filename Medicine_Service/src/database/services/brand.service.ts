import { Op } from "sequelize";
import Brand from "../models/Brand.model";
import log from "../../utils/logger";
import Description, {
  DescriptionAttributes,
} from "database/models/Description.model";
import { DosageFormAttributes } from "database/models/DosageForm.model";
import { GenericAttributes } from "database/models/Generic.model";
import { ManufacturerAttributes } from "database/models/Manufacturer.model";

interface BrandInfo {
  Brand: {
    id: number;
    name: string;
    strength: string;
  };
  DosageForm: DosageFormAttributes;
  Generic: GenericAttributes;
  Manufacturer: ManufacturerAttributes;
  Description: DescriptionAttributes;
}

interface Brand_Service_Interface {
  getBrandById(id: number): Promise<BrandInfo>;
  getBrandByName(_name: string): Promise<Brand>;
  createBrand(_newBrand: Partial<Brand>): Promise<Brand>;
  getAllBrands(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<Brand[]>;
}

export default class dbService_Brand implements Brand_Service_Interface {
  constructor() {}

  async getBrandById(id: number) {
    const brand = await Brand.findByPk(id);
    if (brand === null) {
      log.error(`Brand with id ${id} not found`);
      return null;
    }

    const dosageForm = await brand.getDosageForm();
    const generic = await brand.getGeneric();
    const manufacturer = await brand.getManufacturer();
    const details = await brand.getDescription();

    const brandInfo: BrandInfo = {
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

    return brandInfo;
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
  ) {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      return await Brand.findAll({
        offset,
        limit: itemsPerPage,
      });
    } else {
      return await Brand.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchBy}%`,
          },
        },
        offset,
        limit: itemsPerPage,
      });
    }
  }
}
