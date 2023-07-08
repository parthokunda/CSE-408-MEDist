// external import
import { DataTypes, Model } from "sequelize";

// internal import
import sequelizeConnection from "../config";
import log from "../../utils/logger";


export interface BrandAttributes { 
    id: number;
    name: string;
    strenth: string;
    manufacturer: string;
    description_url: string;
}

class Brand extends Model<BrandAttributes> implements BrandAttributes { 
    public id!: number;
    public name!: string;
    public strenth!: string;
    public manufacturer!: string;
    public description_url!: string;
}

Brand.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    strenth: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    manufacturer: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    description_url: {
        type: DataTypes.STRING(100),
        allowNull: true,
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "brands",
    timestamps: true,
});