import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { existsSync } from "fs";
import { mkdir, appendFile } from "fs/promises";
import path from "path";
const __dirname = path.resolve(path.dirname(""));

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  const logsFolderPath = path.join(__dirname, "..", "logs");
  try {
    if (!existsSync(logsFolderPath)) await mkdir(logsFolderPath);
    await appendFile(path.join(logsFolderPath, logFileName), logItem);
  } catch (error) {
    console.log("Error writing logs", error);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method}\t${req.path}`);
  next();
};
