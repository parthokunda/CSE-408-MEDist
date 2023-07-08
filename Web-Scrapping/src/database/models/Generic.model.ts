// external import
import { DataTypes, Model } from "sequelize";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";


export interface GenericAttributes { 
    id: number;
    name: string;
}

class Generic extends Model<GenericAttributes> implements GenericAttributes {
    public id!: number;
    public name!: string;
}
 

Generic.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(80),
        allowNull: false,
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "generics",
    timestamps: false,
});