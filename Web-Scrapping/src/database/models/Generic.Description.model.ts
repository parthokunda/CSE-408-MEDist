// external import
import {
  Association,
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
} from "sequelize";



// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";

//import model 
import Generic from "./Generic.model";

export interface DescriptionAttributes {
  id: number;
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
  public getGeneric!: HasOneGetAssociationMixin<Generic>;
  public addGeneric!: HasOneSetAssociationMixin<Generic, number>;

  public static associations: {
    generic: Association<Description, Generic>;
  };
}

Description.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    tableName: "generic_descriptions",
    timestamps: true,
  }
);

export default Description;
