// external import
import {
  Association,
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

export interface GenericAttributes {
  id: number;
  name: string;
  type: string;

  // Generic description
  /* indications: string;
  composition: string;
  pharmacology: string;
  dosage_and_administration: string;
  contraindications: string;
  side_effects: string;
  pregnancy_and_lactation: string;
  precautions_and_warnings: string;
  therapeutic_class: string;
  storage_conditions: string; */
}

class Generic extends Model implements GenericAttributes {
  public id!: number;
  public name!: string;
  public type!: string;

  // Generic description
  /* public indications!: string;
  public composition!: string;
  public pharmacology!: string;
  public dosage_and_administration!: string;
  public contraindications!: string;
  public side_effects!: string;
  public pregnancy_and_lactation!: string;
  public precautions_and_warnings!: string;
  public therapeutic_class!: string;
  public storage_conditions!: string; */

  // Define associations
  public getBrands?: HasManyGetAssociationsMixin<Brand>;
  public addBrand!: HasManyAddAssociationMixin<Brand, number>;

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
