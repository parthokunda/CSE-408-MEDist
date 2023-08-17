// external imports
import {
  Association,
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
} from "sequelize";

//internal import
import sequelizeConnection from "../config";
import Doctor from "./Doctor.model";

export interface SingleDaySchedule {
  weekday: number;
  startTime: string;
  endTime: string;
  totalSlots: number;
}

export interface OnlineScheduleAttributes {
  id: number;
  visitFee: number;
  schedule: SingleDaySchedule[];
}

class OnlineSchedule extends Model implements OnlineScheduleAttributes {
  public id!: number;
  public visitFee!: number;
  public schedule!: SingleDaySchedule[];

  // define association
  public getDoctor!: HasOneGetAssociationMixin<Doctor>;
  public setDoctor!: HasOneSetAssociationMixin<Doctor, number>;

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

    visitFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    schedule: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "online_schedule",
  }
);

export default OnlineSchedule;
