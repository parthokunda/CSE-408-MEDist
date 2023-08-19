import { DataTypes, Model } from "sequelize";

//internal import
import sequelizeConnection from "../config";
import { Json } from "sequelize/types/utils";

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: string;
  salt: string;
  google_token: Json;
}

export enum UserRole {
  ADMIN = "admin",
  PATIENT = "patient",
  DOCTOR = "doctor",
  ASSISTANT = "assistant",
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public salt!: string;
  public google_token: Json;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM,
      values: Object.values(UserRole),
      defaultValue: UserRole.PATIENT,
    },

    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    google_token: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
