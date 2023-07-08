// external import
import { DataTypes, Model } from "sequelize";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";

export interface DosageFormAttributes {
  id: number;
  name: string;
  img_url: string;
}

class DosageForm
  extends Model<DosageFormAttributes>
  implements DosageFormAttributes
{
  public id!: number;
  public name!: string;
  public img_url!: string;
}

DosageForm.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING(100),
      allowNull: true,
    }
  },
  {
    sequelize: sequelizeConnection,
    tableName: "dosage_forms",
    timestamps: false,
  }
);

export default DosageForm;