// external imports
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  Optional,
} from "sequelize";

// sequelize connection
import sequelizeConnection from "../config";
import Appointment from "./Appointment.model";
import Prescription_Medicines from "./Prescription_Medicines.model";

export interface PrescriptionAttributes {
  id: number;

  symptoms: string[];
  diagnosis: string[];
  advices: string[];
  followUpDate: Date;
  otherNotes: string[];
}

class Prescription extends Model implements PrescriptionAttributes {
  public id!: number;
  public appointmentID!: number;

  public symptoms!: string[];
  public diagnosis!: string[];
  public advices!: string[];
  public followUpDate!: Date;
  public otherNotes!: string[];

  // define associations
  public getAppointment!: HasOneGetAssociationMixin<Appointment>;
  public setAppointment!: HasOneSetAssociationMixin<Appointment, number>;

  public getPrescription_Medicines!: HasManyGetAssociationsMixin<Prescription_Medicines>;
  public addPrescription_Medicines!: HasManyAddAssociationMixin<
    Prescription_Medicines,
    number
  >;

  public static associations: {
    appointment: Association<Prescription, Appointment>;
    prescription_medicines: Association<Prescription, Prescription_Medicines>;
  };
}

Prescription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    appointmentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    symptoms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    diagnosis: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    advices: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    otherNotes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "prescriptions",
  }
);

export default Prescription;
