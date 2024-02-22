import dayjs from "dayjs";
import logger from "pino";
import pinoPretty from "pino-pretty";

const log = logger({
  transport: {
    target: "pino-pretty",
    crlf: false,
  },
  prettifier: pinoPretty,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  level: "trace",
});

export default log;
