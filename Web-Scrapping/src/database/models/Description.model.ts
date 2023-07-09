// external import
import {
  Association,
  DataTypes,
  HasOneGetAssociationMixin,
  Model,
} from "sequelize";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";

// import models
import Brand from "./Brand.model";

export interface DescriptionAttributes {
  id: number;
  unit_price: string;
  indications: string;
  compositions: string;
  pharmacology: string;
  dosage_and_administration: string;
  interaction: string;
  contraindications: string;
  side_effects: string;
  pregnancy_and_lactation: string;
  precautions_and_warnings: string;
  overdose_effects: string;
  therapeutic_class: string;
  storage_conditions: string;
}

class Description
  extends Model<DescriptionAttributes>
  implements DescriptionAttributes
{
  public id!: number;
  public unit_price!: string;
  public indications!: string;
  public compositions!: string;
  public pharmacology!: string;
  public dosage_and_administration!: string;
  public interaction!: string;
  public contraindications!: string;
  public side_effects!: string;
  public pregnancy_and_lactation!: string;
  public precautions_and_warnings!: string;
  public overdose_effects!: string;
  public therapeutic_class!: string;
  public storage_conditions!: string;

  // Define associations
  public getBrand!: HasOneGetAssociationMixin<Brand>;

  public static associations: {
    brand: Association<Description, Brand>;
  };
}

Description.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    unit_price: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    indications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    compositions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pharmacology: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dosage_and_administration: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    interaction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contraindications: {
      type: DataTypes.TEXT,

      allowNull: true,
    },
    side_effects: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pregnancy_and_lactation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precautions_and_warnings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    overdose_effects: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    therapeutic_class: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storage_conditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "descriptions",
    timestamps: true,
  }
);


export default Description;
