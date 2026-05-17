const winston = require("winston");

const isDevelopment = process.env.NODE_ENV !== "production";

const logger = winston.createLogger({
  // In production, only log info and above (suppress debug noise)
  level: isDevelopment ? "debug" : "info",

  // Always store logs as JSON internally
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // include stack trace on errors
    winston.format.json()
  ),

  // Where logs go
  transports: [
    new winston.transports.Console({
      // In development, use a human-readable format instead of raw JSON
      format: isDevelopment
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              const metaStr = Object.keys(meta).length
                ? "\n" + JSON.stringify(meta, null, 2)
                : "";
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
          )
        : winston.format.json(),
    }),
  ],
});

module.exports = logger;