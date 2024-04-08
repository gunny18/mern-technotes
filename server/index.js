import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { logger, logEvents } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import cors from "cors";
import { connectDB } from "./config/dbConnection.js";
import mongoose from "mongoose";
import { router as userRouter } from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
