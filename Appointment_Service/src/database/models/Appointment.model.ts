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
import Prescription_Medicines from "./Prescription_Medicines.model";

export const WeekName = [
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

export enum AppointmentStatus {
  PENDING = "pending",
  PRESCRIBED = "prescribed",
  RATED = "rated",
  COMPLETED = "completed",
  TEMPORARY = "temporary",
}

export enum AppointmentType {
  ONLINE = "online",
  PHYSICAL = "physical",
}

export interface Patient_or_Doctor_Info {
  id: number;
  name: string;
  email: string;
}

export interface PendingAppointmentOverviewInfo {
  id: number;
  type: AppointmentType;

  patientInfo: Patient_or_Doctor_Info | null;

  doctorInfo: Patient_or_Doctor_Info | null;

  startTime: Date;
  endTime: Date;

  status: AppointmentStatus;

  meetingLink: string | null;
}

export interface PendingAppointments {
  appointments: PendingAppointmentOverviewInfo[];
  totalCount: number;
}

export interface AppointmentAttributes {
  id: number;
  type: AppointmentType;

  patientID: number;
  patientEmail: string;
  patientName: string;

  doctorID: number;
  doctorEmail: string;
  doctorName: string;

  prescriptionID: number;

  startTime: Date;
  endTime: Date;

  status: AppointmentStatus;

  meetingLink: string;
  rating: number;

  createdAt?: Date;
  updatedAt?: Date;
}

class Appointment extends Model implements AppointmentAttributes {
  public id!: number;
  public type!: AppointmentType;

  public patientID!: number;
  public patientEmail: string;
  public patientName!: string;

  public doctorID!: number;
  public doctorEmail!: string;
  public doctorName!: string;

  public startTime!: Date;
  public endTime!: Date;

  public status!: AppointmentStatus;

  public meetingLink!: string;
  public rating!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // define associations
  public prescriptionID!: number;
  public getPrescription!: BelongsToGetAssociationMixin<Prescription>;
  public setPrescription!: BelongsToSetAssociationMixin<Prescription, number>;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM,
      values: Object.values(AppointmentType),
      allowNull: false,
    },

    patientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    patientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    patientEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    doctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    doctorEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    doctorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    prescriptionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM,
      values: Object.values(AppointmentStatus),
      defaultValue: AppointmentStatus.PENDING,
      allowNull: false,
    },

    meetingLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "appointments",
    timestamps: true,
  }
);

//------------------------- relations -------------------------//

// between Appointment and Prescription
Appointment.belongsTo(Prescription, {
  foreignKey: "prescriptionID",
});

Prescription.hasOne(Appointment, {
  foreignKey: "prescriptionID",
});

// between Prescription and Prescription_Medicines
Prescription.hasMany(Prescription_Medicines, {
  foreignKey: "prescriptionID",
});

Prescription_Medicines.belongsTo(Prescription, {
  foreignKey: "prescriptionID",
});

export default Appointment;
