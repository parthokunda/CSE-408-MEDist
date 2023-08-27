// external imports
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";

//internal import
import sequelizeConnection from "../config";
import Doctor from "./Doctor.model";

export const WeekName = [
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

export interface OnlineScheduleOverviewInfo
  extends Omit<
    OnlineScheduleAttributes,
    "doctorID" | "createdAt" | "updatedAt"
  > {}

export interface OnlineScheduleInfo
  extends Omit<
    OnlineScheduleAttributes,
    "doctorID" | "createdAt" | "updatedAt"
  > {}

export interface OnlineScheduleInput
  extends Omit<OnlineScheduleAttributes, "id" | "doctorID"> {}

export const OnlineScheduleInfo_Excluded_Properties: (
  | "doctorID"
  | "createdAt"
  | "updatedAt"
)[] = ["doctorID", "createdAt", "updatedAt"];

export const OnlineSchedule_Excluded_Properties: (
  | "doctorID"
  | "createdAt"
  | "updatedAt"
)[] = ["doctorID", "createdAt", "updatedAt"];

export interface OnlineScheduleAttributes {
  id: number;
  weekday: number;
  weekname: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  remainingSlots: number;
  doctorID: number;
}

class OnlineSchedule extends Model implements OnlineScheduleAttributes {
  public id!: number;
  public weekday!: number;
  public weekname!: string;
  public startTime!: string;
  public endTime!: string;
  public totalSlots!: number;
  public remainingSlots!: number;

  // define associations
  public doctorID!: number;
  public getDoctor!: BelongsToGetAssociationMixin<Doctor>;
  public setDoctor!: BelongsToSetAssociationMixin<Doctor, number>;

  public static associations: {
    doctor: Association<OnlineSchedule, Doctor>;
  };
}

OnlineSchedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    weekday: {
      //between 0 to 6
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    weekname: {
      type: DataTypes.STRING,
      values: WeekName,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    totalSlots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    remainingSlots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "online_schedule",
  }
);

export default OnlineSchedule;
