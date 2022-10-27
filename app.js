const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");

const cors = require("cors");

dotenv.config();

const MONGO_URL =
  "mongodb+srv://maurice:mcOWRMghRSo8ljYf@cluster0.zqnfjtu.mongodb.net/?retryWrites=true&w=majority";

const connectWithRetry = () => {
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
