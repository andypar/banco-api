require("winston-daily-rotate-file");

const { createLogger, transports, format } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, json } = format;
const CATEGORY = "DEV";

const fileRotateTransportError = new transports.DailyRotateFile({
  filename: "logs/rotate-error-%DATE%.log",
  level: "error",
  levelOnly: true,
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
});

const fileRotateTransportInfo = new transports.DailyRotateFile({
  filename: "logs/rotate-info-%DATE%.log",
  level: "info",
  levelOnly: true,
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
});

const fileRotateTransportWarn = new transports.DailyRotateFile({
  filename: "logs/rotate-warn-%DATE%.log",
  level: "warn",
  levelOnly: true,
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
});

// const fileRotateTransportAll = new transports.DailyRotateFile({
//   filename: "logs/rotate-%DATE%.log",
//   datePattern: "YYYY-MM-DD",
//   maxFiles: "1d",
// });

const logger = createLogger({
  level: "dev",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransportError,
    fileRotateTransportWarn,
    fileRotateTransportInfo,
    // fileRotateTransportAll,
    new transports.Console(),
  ],
});

module.exports = logger;
