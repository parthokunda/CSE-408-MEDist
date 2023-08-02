import { Op } from "sequelize";
import Manufacturer from "../models/Manufacturer.model";

interface ManufacturerInterface { 
  getManufacturerByName(_name: string): Promise<Manufacturer | null>;
  getManufacturerById(id: number): Promise<Manufacturer | null>;
  createManufacturer(_newManufacturer: Partial<Manufacturer>): Promise<Manufacturer>;
  getAllManufacturers(searchBy: string, pagination: number, currentPage: number): Promise<Manufacturer[]>;
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
  ) {
    const itemsPerPage = pagination;
    const offset = (currentPage - 1) * itemsPerPage;

    if (searchBy === "" || searchBy === undefined || searchBy === null) {
      return await Manufacturer.findAll({
        offset,
        limit: itemsPerPage,
      });
    } else {
      return await Manufacturer.findAll({
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
