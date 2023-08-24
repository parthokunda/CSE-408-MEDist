import { DataTypes, Model } from "sequelize";

//internal import
import sequelizeConnection from "../config";

export enum PatientStatus {
  FULLY_REGISTERED = "fully_registered",
  PARTIALLY_REGISTERED = "partially_registered",
}

export enum PatientGendar {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum PatientBloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  NOT_KNOWN = "not_known",
}

export interface PatientOverviewInfo {
  PatientInfo: Omit<PatientAttributes, "userID" | "status" | "address">;
}

export interface PatientAdditionalInfo {
  PatientInfo: Omit<PatientAttributes, "userID">;
}

export interface UpdatedPatientAdditionalInfo {
  PatientInfo: Omit<PatientAttributes, "userID" | "height"> & {
    height: {
      feet: number;
      inches: number;
    };
  };
}

export const PatientAdditionalInfo_Excluded_Properties: "userID"[] = ["userID"];

export const PatientOverviewInfo_Excluded_Properties: (
  | "userID"
  | "status"
  | "address"
)[] = ["userID", "status", "address"];

export interface PatientAttributes {
  id: number;
  status: string;
  userID: number;

  // additional info
  email: string;
  image: string;
  name: string;
  phone: string;
  gendar: string;
  dob: Date;
  address: string;
  bloodGroup: string;
  height: number;
  weight: number;
}

interface PatientCreationAttributes extends Partial<PatientAttributes> {}

class Patient
  extends Model<PatientAttributes, PatientCreationAttributes>
  implements PatientAttributes
{
  public id!: number;
  public name!: string;
  public userID!: number;
  public status: string;

  // additional info
  public email: string;
  public image: string;
  public phone: string;
  public gendar: string;
  public dob: Date;
  public address: string;
  public bloodGroup: string;
  public height: number;
  public weight: number;
}

Patient.init(
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
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM,
      values: Object.values(PatientStatus),
      defaultValue: PatientStatus.PARTIALLY_REGISTERED,
    },

    // additional info
    gendar: {
      type: DataTypes.ENUM,
      values: Object.values(PatientGendar),
      defaultValue: PatientGendar.OTHER,
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bloodGroup: {
      type: DataTypes.ENUM,
      values: Object.values(PatientBloodGroup),
      defaultValue: PatientBloodGroup.NOT_KNOWN,
    },

    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "patients",
    timestamps: true,
  }
);

export default Patient;
