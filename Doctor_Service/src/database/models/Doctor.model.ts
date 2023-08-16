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
import Specialization from "./Specialization.model";

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

export interface DoctorAttributes {
  id: number;
  status: string;
  userID: number;

  // additional info
  image: string;
  name: string;
  phone: string;
  gendar: string;
  dmdc: string;
  issueDate: Date;
  degrees: JSON;

  specializationID: number;
}

interface DoctorCreationAttributes extends Partial<DoctorAttributes> {}

class Doctor extends Model implements DoctorAttributes {
  public id!: number;
  public name!: string;
  public userID!: number;
  public status: string;

  // additional info
  public image: string;
  public phone: string;
  public gendar: string;
  public dmdc: string;
  public issueDate: Date;
  public degrees: JSON;

  // define associations
  public specializationID!: number;
  public getSpecialization!: BelongsToGetAssociationMixin<Specialization>;
  public setSpecialization!: BelongsToSetAssociationMixin<
    Specialization,
    number
  >;

  public static associations: {
    specialization: Association<Doctor, Specialization>;
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

    dmdc: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    issueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    degrees: {
      type: DataTypes.JSON,
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

export default Doctor;
