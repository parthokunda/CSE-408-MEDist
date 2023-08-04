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
import Brand from "./Brand.model";

export interface GenericAttributes {
  id: number;
  name: string;
  type: string;
}

class Generic extends Model implements GenericAttributes {
  public id!: number;
  public name!: string;
  public type!: string;

  // Define associations
  public getBrands?: HasManyGetAssociationsMixin<Brand>;
  public addBrand!: HasManyAddAssociationMixin<Brand, number>;
  public countBrands!: HasManyCountAssociationsMixin;

  public static associations: {
    brands: Association<Generic, Brand>;
  };
}

Generic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Allopathic",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "generics",
    timestamps: false,
  }
);

export default Generic;
