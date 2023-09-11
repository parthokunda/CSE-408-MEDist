// external imports
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Optional,
} from "sequelize";

// sequelize connection
import sequelizeConnection from "../config";

//internal import
import Specialization, {
  SpecializationAttributes,
} from "./Specialization.model";
import OnlineSchedule, {
  OnlineScheduleAttributes,
  OnlineScheduleInfo,
  OnlineScheduleOverviewInfo,
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
  | "online_visit_fee"
  | "createdAt"
  | "updatedAt"
)[] = [
  "userID",
  "scheduleID",
  "specializationID",
  "online_visit_fee",
  "createdAt",
  "updatedAt",
];

export const DoctorOverviewInfo_Excluded_Properties: (
  | "userID"
  | "scheduleID"
  | "specializationID"
  | "status"
  | "dob"
  | "phone"
  | "createdAt"
  | "updatedAt"
)[] = [
  "userID",
  "scheduleID",
  "specializationID",
  "status",
  "dob",
  "phone",
  "createdAt",
  "updatedAt",
];

export interface SearchDoctorInfo {
  Doctors: DoctorOverviewInfo[];
  totalCount: number;
}

export interface DoctorAdditionalInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    | "userID"
    | "scheduleID"
    | "specializationID"
    | "online_visit_fee"
    | "createdAt"
    | "updatedAt"
  >;
  Specialization: SpecializationAttributes | {};
}

export interface OnlineScheduleOverview {
  visit_fee: number;
  schedules: OnlineScheduleOverviewInfo[];
}

export interface DoctorOnlineScheduleInfo {
  visit_fee: number;
  schedules: OnlineScheduleInfo[];
}

export interface DoctorProfileInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "createdAt" | "updatedAt" | "online_visit_fee"
  >;
  Specialization: SpecializationAttributes | {};
  OnlineSchedule: OnlineScheduleOverview;
}

export const DoctorProfileInfo_Excluded_Properties: (
  | "userID"
  | "scheduleID"
  | "createdAt"
  | "updatedAt"
  | "online_visit_fee"
)[] = ["userID", "scheduleID", "createdAt", "updatedAt", "online_visit_fee"];

export interface DoctorOverviewInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    | "userID"
    | "scheduleID"
    | "specializationID"
    | "status"
    | "dob"
    | "phone"
    | "createdAt"
    | "updatedAt"
  >; // exclude userID, scheduleID, specializationID

  Specialization: SpecializationAttributes | {};
}

export interface PrescriptionDoctorInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    | "userId"
    | "scheduleId"
    | "specializationId"
    | "status"
    | "dob"
    | "online_visit_fee"
    | "gender"
    | "bmdc"
    | "issueDate"
    | "createdAt"
    | "updatedAt"
  >;
  Specialization: SpecializationAttributes;
}

export const PrescriptionDoctorInfo_Excluded_Properties: (
  | "userID"
  | "scheduleID"
  | "specializationID"
  | "status"
  | "dob"
  | "online_visit_fee"
  | "gender"
  | "bmdc"
  | "issueDate"
  | "createdAt"
  | "updatedAt"
)[] = [
  "userID",
  "scheduleID",
  "specializationID",
  "status",
  "dob",
  "gender",
  "bmdc",
  "issueDate",
  "online_visit_fee",
  "createdAt",
  "updatedAt",
];

export interface DoctorAttributes {
  id: number;
  status: string;
  userID: number;
  specializationID: number;

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

  // online schedule visit fee
  online_visit_fee: number;
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

  public online_visit_fee!: number;
  public getOnlineSchedules!: HasManyGetAssociationsMixin<OnlineSchedule>;
  public addOnlineSchedule!: HasManyAddAssociationMixin<OnlineSchedule, number>;

  public static associations: {
    specialization: Association<Doctor, Specialization>;
    online_schedules: Association<Doctor, OnlineSchedule>;
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

    online_visit_fee: {
      type: DataTypes.INTEGER,
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
Doctor.hasMany(OnlineSchedule, {
  foreignKey: "doctorID",
});

OnlineSchedule.belongsTo(Doctor, {
  foreignKey: "doctorID",
});

export default Doctor;
