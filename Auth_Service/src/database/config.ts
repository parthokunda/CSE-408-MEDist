// external import
import { Dialect, Sequelize } from "sequelize";

// internal import
import { config } from "../config";

const dbName = config.DB.NAME;
const dbUser = config.DB.USER;
const dbHost = config.DB.HOST;
const dbDriver = config.DB.DRIVER;
const dbPassword = config.DB.PASSWORD;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  logging: false,
});

export default sequelizeConnection;
