const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/user");
const productsRoute = require("./routes/products");
const categoriesRoute = require("./routes/category");
const costumersRoute = require("./routes/costumers");
const promotionsRoute = require("./routes/promotion");
const billersRoute = require("./routes/biller");
const paymentmethodRoute = require("./routes/paymentmethod");
const deliveryOccurRoute = require("./routes/deliveryoccur");

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
app.use("/api/users", usersRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/products", productsRoute);
app.use("/api/costumers", costumersRoute);
app.use("/api/promotion", promotionsRoute);
app.use("/api/biller", billersRoute);
app.use("/api/paymentmethod", paymentmethodRoute);
app.use("/api/deliveryoccur", deliveryOccurRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});

// 200 : OK
// 201 : CREATED
// 400 : BAD REQUEST
// 401 : UNAUTHORIZED
// 403 : FORBIDDEN
// 404 : NOT FOUND

// https://monjay.app.qore.com.au/customers/add
// admin@mjmezza.com.au
// Holden15
