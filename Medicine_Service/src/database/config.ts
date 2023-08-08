// external import
import { Dialect, Sequelize } from "sequelize";

// internal import
import { config } from "../config";

const sequelizeConnection = new Sequelize(config.DB.URL, {
  dialect: "postgres" as Dialect,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

export default sequelizeConnection;
