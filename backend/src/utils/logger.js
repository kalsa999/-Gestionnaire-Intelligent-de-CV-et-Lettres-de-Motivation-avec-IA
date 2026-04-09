const winston = require("winston");

// Winston — Professional logging library instead of console.log // // Why Winston instead of console.log? // ✅ We can specify the severity level: debug, info, warn, error //✅ We save the logs to files (for production) //✅ We automatically add timestamp to each message //✅ We color the messages in the terminal //================================================================

const { combine, timestamp, colorize, printf, errors } = winston.format;

// Special format for displaying logs
const logFormat = printf(({ timestamp, level, message, stack }) => {
 // If there is a stack trace (from Error), we display it in full
  if (stack) {
    return `${timestamp} [${level}]: ${message}\n${stack}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
// In development we see everything, in production only errors
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",

  format: combine(
    errors({ stack: true }), // Displays stack trace automatically
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(), // Colors in terminal
    logFormat
  ),

  transports: [
   
// Always send to console
    new winston.transports.Console(),

    // In production: Save errors to a separate file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // In production: Save everything to a file
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

module.exports = logger;
