// external import
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
} from "sequelize";

//import "./associations";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";
import Brand from "./Brand.model";
import Generic_Description from "./Generic.Description.model";

export interface GenericAttributes {
  id: number;
  name: string;
  type: string;

  // generic description
  descriptionID: number;
}

class Generic extends Model implements GenericAttributes {
  public id!: number;
  public name!: string;
  public type!: string;

  // Generic description
  public descriptionID!: number;

  // Define associations
  public getBrands?: HasManyGetAssociationsMixin<Brand>;
  public addBrand!: HasManyAddAssociationMixin<Brand, number>;

  public getDescription!: BelongsToGetAssociationMixin<Generic_Description>;
  public setDescription!: BelongsToSetAssociationMixin<
    Generic_Description,
    number
  >;

  public static associations: {
    brands: Association<Generic, Brand>;
    description: Association<Generic, Generic_Description>;
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
      unique: true,
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
