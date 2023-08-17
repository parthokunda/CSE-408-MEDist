// external imports
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
  Optional,
} from "sequelize";

//internal import
import sequelizeConnection from "../config";
import Specialization, {
  SpecializationAttributes,
} from "./Specialization.model";
import OnlineSchedule, {
  OnlineScheduleAttributes,
} from "./Online_Schedule.model";

export enum DoctorStatus {
  FULLY_REGISTERED = "fully_registered",
  PARTIALLY_REGISTERED = "partially_registered",
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
}

export enum DoctorGendar {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export const DoctorAdditionalInfo_Excluded_Properties: (
  | "userID"
  | "scheduleID"
  | "specializationID"
)[] = ["userID", "scheduleID", "specializationID"];

export const DoctorOverviewInfo_Excluded_Properties: (
  | "userID"
  | "scheduleID"
  | "specializationID"
  | "status"
  | "dob"
  | "phone"
)[] = ["userID", "scheduleID", "specializationID", "status", "dob", "phone"];

export interface SearchDoctorInfo {
  Doctors: DoctorOverviewInfo[];
  totalCount: number;
}

export interface DoctorAdditionalInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "specializationID"
  >;
  Specialization: SpecializationAttributes;
}

export interface DoctorProfileInfo {
  DoctorInfo: DoctorAttributes;
  Specialization: SpecializationAttributes;
  OnlineSchedule: OnlineScheduleAttributes;
}

export interface DoctorOverviewInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "specializationID" | "status" | "dob" | "phone"
  >; // exclude userID, scheduleID, specializationID

  Specialization: SpecializationAttributes;
}

export interface DoctorAttributes {
  id: number;
  status: string;
  userID: number;

  // additional info
  image: string;
  name: string;
  email: string;
  phone: string;
  gendar: string;
  dob: Date;
  bmdc: string;
  issueDate: Date;
  degrees: string[];

  specializationID: number;
  scheduleID: number;
}

class Doctor extends Model implements DoctorAttributes {
  public id!: number;
  public name!: string;
  public userID!: number;
  public status: string;

  // additional info
  public image: string;
  public email: string;
  public phone: string;
  public gendar: string;
  public dob: Date;
  public bmdc: string;
  public issueDate: Date;
  public degrees: string[];

  // define associations
  public specializationID!: number;
  public getSpecialization!: BelongsToGetAssociationMixin<Specialization>;
  public setSpecialization!: BelongsToSetAssociationMixin<
    Specialization,
    number
  >;

  public scheduleID!: number;
  public getOnlineSchedule!: BelongsToGetAssociationMixin<OnlineSchedule>;
  public setOnlineSchedule!: BelongsToSetAssociationMixin<
    OnlineSchedule,
    number
  >;

  public static associations: {
    specialization: Association<Doctor, Specialization>;
    onlineSchedule: Association<Doctor, OnlineSchedule>;
  };
}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    userID: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM,
      values: Object.values(DoctorStatus),
      defaultValue: DoctorStatus.PARTIALLY_REGISTERED,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gendar: {
      type: DataTypes.ENUM,
      values: Object.values(DoctorGendar),
      defaultValue: DoctorGendar.OTHER,
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    bmdc: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    issueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    degrees: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    tableName: "doctors",
    sequelize: sequelizeConnection,
  }
);

// relation between Doctor and Specialization
Doctor.belongsTo(Specialization, {
  foreignKey: {
    name: "specializationID",
    allowNull: true,
  },
});

Specialization.hasMany(Doctor, {
  foreignKey: "specializationID",
});

// relation between Doctor and OnlineSchedule
Doctor.belongsTo(OnlineSchedule, {
  foreignKey: {
    name: "scheduleID",
    allowNull: true,
  },
});

OnlineSchedule.hasOne(Doctor, {
  foreignKey: {
    name: "scheduleID",
  },
});

export default Doctor;
