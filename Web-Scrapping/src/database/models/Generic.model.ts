// external import
import { Association, DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";
import Brand from "./Brand.model";

export interface GenericAttributes {
  id: number;
  name: string;
}

class Generic extends Model implements GenericAttributes {
  public id!: number;
  public name!: string;

  // Define associations
  public getBrands?: HasManyGetAssociationsMixin<Brand>;
  public static associations: {
    brands: Association<Generic, Brand>;
    // It specifies that the Generic model has a one-to-many association
    // with the Brand model, where each Generic can have multiple Brand instances.
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
      type: DataTypes.STRING(80),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "generics",
    timestamps: false,
  }
);

export default Generic;
