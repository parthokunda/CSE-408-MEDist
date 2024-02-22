// external imports
import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
} from "sequelize";

//internal import
import sequelizeConnection from "../config";
import Doctor from "./Doctor.model";

export interface SpecializationAttributes {
  id: number;
  name: string;
}

interface SpecializationCreationAttributes
  extends Partial<SpecializationAttributes> {}

class Specialization
  extends Model<SpecializationAttributes, SpecializationCreationAttributes>
  implements SpecializationAttributes
{
  public id!: number;
  public name!: string;

  // define associations
  public getDoctors!: HasManyGetAssociationsMixin<Doctor>;
  public addDoctor!: HasManyAddAssociationMixin<Doctor, number>;

  public static associations: {
    doctors: Association<Specialization, Doctor>;
  };
}

Specialization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "specializations",
    sequelize: sequelizeConnection,
    timestamps: false,
  }
);

export default Specialization;
