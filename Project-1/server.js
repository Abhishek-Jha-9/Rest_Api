import Express from "express";
import { APP_PORT, DB_URL } from "./config";
const app = Express();
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import auth from "./middlewares/auth";
import path from "path";
import admin from "./middlewares/admin";

global.appRoot = path.resolve(__dirname);

// databse connection
mongoose.connect(DB_URL, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connection Successful!... DB connected...");
});

app.use(Express.urlencoded({ extended: false }));

app.use(Express.json());

app.use("/api", routes);
app.use("/uploads", Express.static("uploads"));

app.use(errorHandler);
app.use(auth);
app.use(admin);
app.listen(APP_PORT, () => console.log(`Listening on Port ${APP_PORT}.`));
