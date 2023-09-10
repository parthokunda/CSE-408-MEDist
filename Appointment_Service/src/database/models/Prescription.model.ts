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
import Appointment, { AppointmentStatus, OlderAppointmentOverviewInfo } from "./Appointment.model";
import Prescription_Medicines, {
  BrandInfo,
} from "./Prescription_Medicines.model";

export interface DoctorPortion {
  DoctorInfo: {
    id: number;
    name: string;
    email: string;
    image: string;

    phone: string;
    degrees: string[];
  };
  Specialization: {
    id: number;
    name: string;
  };
}

export interface PatientPortion {
  id: number;
  name: string;
  email: string;
  image: string;

  phone: string;
  gendar: string;
  age: number;
  bloodGroup: string;
  height: {
    feet: number;
    inches: number;
  };
  weight: number;
}

export interface AppointmentPortion {
  id: number;
  type: string;
  time: Date;
  status : AppointmentStatus;
}

export interface PrescriptionHeader {
  DoctorPortionInfo: DoctorPortion;
  PatientPortionInfo: PatientPortion;
  AppointmentPortionInfo: AppointmentPortion;
  OldAppointments: OlderAppointmentOverviewInfo[];
  SharedAppointments: OlderAppointmentOverviewInfo[];
}

export interface PrescriptionAttributes {
  id: number;

  symptoms: string[];
  diagnosis: string[];
  advices: string[];
  followUpDate: Date;
  meetAfter: number;
  otherNotes: string[];
  past_history: string[];
}

export interface PrescriptionOutput extends PrescriptionAttributes {
  Header: PrescriptionHeader;
  Medicines: BrandInfo[];
}

class Prescription extends Model implements PrescriptionAttributes {
  public id!: number;
  public appointmentID!: number;

  public symptoms!: string[];
  public diagnosis!: string[];
  public advices!: string[];
  public followUpDate!: Date;
  public meetAfter!: number;
  public otherNotes!: string[];
  public past_history!: string[];

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

    past_history: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

    meetAfter: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "prescriptions",
  }
);

export default Prescription;
