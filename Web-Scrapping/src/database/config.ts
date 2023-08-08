// external import
import { Dialect, Sequelize } from "sequelize";
require("dotenv").config();

// internal import
// import { config } from "../config";

// const dbName = config.DB.NAME;
// const dbUser = config.DB.USER;
// const dbHost = config.DB.HOST;
// const dbDriver = config.DB.DRIVER;
// const dbPassword = config.DB.PASSWORD;

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sequelizeConnection = new Sequelize(URL, {
  dialect: "postgres" as Dialect,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

export default sequelizeConnection;
