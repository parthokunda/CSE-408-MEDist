import dayjs from "dayjs";
import logger from "pino";

const log = logger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: true,
      ignore: "pid,hostname",
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  level: "trace",
});

export default log;
