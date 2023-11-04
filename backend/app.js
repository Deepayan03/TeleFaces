import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConfig from "./configs/dbConfig.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

dbConfig();

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api/backend", (req, res) => {
  res.send("App is working properly");
});
app.use("/api/users", userRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server started at port ${process.env.PORT}`)
);
