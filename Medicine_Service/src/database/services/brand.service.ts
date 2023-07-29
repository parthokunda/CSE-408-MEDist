import { Op } from "sequelize";
import Brand from "../models/Brand.model";
import log from "../../utils/logger";

interface BrandInterface {
  getBrandById(id: number): Promise<Brand | null>;
  getBrandByName(_name: string): Promise<Brand | null>;
  createBrand(_newBrand: Partial<Brand>): Promise<Brand>;
  getAllBrands(
    searchBy: string,
    pagination: number,
    currentPage: number
  ): Promise<Brand[]>;
}

export default class dbService_Brand implements BrandInterface {
  constructor() {}

  async getBrandById(id: number) {
    return await Brand.findByPk(id);
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
