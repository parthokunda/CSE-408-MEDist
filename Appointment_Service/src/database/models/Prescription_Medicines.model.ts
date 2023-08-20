// external imports
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
  Optional,
} from "sequelize";

// sequelize connection
import sequelizeConnection from "../config";
import Prescription from "./Prescription.model";

export interface Prescription_MedicinesAttributes {
  id: number;
  medicineID: number;

  //instructions
  dosage: string;
  when: string;
  duration: string;
}

class Prescription_Medicines
  extends Model
  implements Prescription_MedicinesAttributes
{
  public id!: number;

  public medicineID!: number;

  //instructions
  public dosage!: string;
  public when!: string;
  public duration!: string;

  // define associations
  public prescriptionID!: number;
  public getPrescription!: BelongsToGetAssociationMixin<Prescription>;
  public setPrescription!: BelongsToSetAssociationMixin<Prescription, number>;

  public static associations: {
    prescription: Association<Prescription_Medicines, Prescription>;
  };
}

Prescription_Medicines.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    prescriptionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    medicineID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    when: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "prescription_medicines",
    sequelize: sequelizeConnection,
    timestamps: false,
  }
);

export default Prescription_Medicines;