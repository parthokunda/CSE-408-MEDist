// external import
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";

////import "./associations";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";

// import models
import Generic from "./Generic.model";
import DosageForm from "./DosageForm.model";
import Manufacturer from "./Manufacturer.model";
import Description from "./Description.model";

interface BrandAttributes {
  id: number;
  name: string;
  strength: string;
  manufacturer: string;
  description_url: string;
  unit_price: string;

  genericID: number;
  dosageFormID: number;
  manufacturerID: number;
  descriptionID: number;
}

class Brand extends Model implements BrandAttributes {
  public id!: number;
  public name!: string;
  public strength!: string;
  public manufacturer!: string;
  public description_url!: string;
  public unit_price!: string;
  public genericID!: number;
  public dosageFormID!: number;
  public manufacturerID!: number;
  public descriptionID!: number;

  // Define associations
  public getGeneric!: BelongsToGetAssociationMixin<Generic>;
  public setGeneric!: BelongsToSetAssociationMixin<Generic, number>;

  public getDosageForm!: BelongsToGetAssociationMixin<DosageForm>;
  public setDosageForm!: BelongsToSetAssociationMixin<DosageForm, number>;

  public getManufacturer!: BelongsToGetAssociationMixin<Manufacturer>;
  public setManufacturer!: BelongsToSetAssociationMixin<Manufacturer, number>;

  public getDescription!: BelongsToGetAssociationMixin<Description>;
  public setDescription!: BelongsToSetAssociationMixin<Description, number>;

  public static associations: {
    generic: Association<Brand, Generic>;
    dosageForm: Association<Brand, DosageForm>;
    manufacturer: Association<Brand, Manufacturer>;
    description: Association<Brand, Description>;
  };
}

Brand.init(
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
    strength: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    description_url: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "brands",
    timestamps: true,
  }
);

/* ................ Define associations ................. */

// between Brand and Generic
Brand.belongsTo(Generic, {
  foreignKey: "genericID",
});
Generic.hasMany(Brand, {
  foreignKey: "genericID",
});

// between Brand and DosageForm
Brand.belongsTo(DosageForm, {
  foreignKey: "dosageFormID",
});
DosageForm.hasMany(Brand, {
  foreignKey: "dosageFormID",
});

// between Brand and Manufacturer
Brand.belongsTo(Manufacturer, {
  foreignKey: "manufacturerID",
});
Manufacturer.hasMany(Brand, {
  foreignKey: "manufacturerID",
});

// between Brand and Description
Brand.belongsTo(Description, {
  foreignKey: {
    name: "descriptionID",
    allowNull: true,
  },
});
Description.hasOne(Brand, {
  foreignKey: {
    name: "descriptionID",
    allowNull: true,
  },
});

export default Brand;
