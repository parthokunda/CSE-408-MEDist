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

export enum AppointmentStatus {
  PENDING = "pending",
  PRESCRIBED = "prescribed",
  RATED = "rated",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum AppointmentType {
  ONLINE = "online",
  PHYSICAL = "physical",
}

export interface AppointmentAttributes {
  id: number;
  type: AppointmentType;

  patientID: number;
  doctorID: number;
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
  public doctorID!: number;

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

    doctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      allowNull: false,
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
