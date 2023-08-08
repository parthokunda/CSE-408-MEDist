// external import
import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  Model,
} from "sequelize";

//import "./associations";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";

// import models
import Brand from "./Brand.model";

export interface ManufacturerAttributes {
  id: number;
  name: string;
}

class Manufacturer
  extends Model<ManufacturerAttributes>
  implements ManufacturerAttributes
{
  public id!: number;
  public name!: string;

  // Define associations
  public getBrands?: HasManyGetAssociationsMixin<Brand>;
  public addBrand!: HasManyAddAssociationMixin<Brand, number>;
  public countBrands!: HasManyCountAssociationsMixin;

  public static associations: {
    brands: Association<Manufacturer, Brand>;
  };
}

Manufacturer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "manufacturers",
    timestamps: false,
  }
);

export default Manufacturer;
