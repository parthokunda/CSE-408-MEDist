import { DataTypes, Model } from "sequelize";

//internal import
import sequelizeConnection from "../config";

export interface PatientAttributes {
  id: number;
  name: string;
  phone: string;

  //foreign key
  userID: number;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
  public id!: number;
  public name!: string;
  public phone!: string;
  public userID!: number;
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

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "patients",
    timestamps: true,
  }
);

export default Patient;
