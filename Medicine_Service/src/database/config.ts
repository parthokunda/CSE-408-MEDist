// external import
import { Dialect, Sequelize } from "sequelize";

// internal import
import { config } from "../config";

const sequelizeConnection = new Sequelize(config.DB.URL, {
  logging: false,
  dialect: "postgres" as Dialect,
  dialectOptions: {},
});

export default sequelizeConnection;
