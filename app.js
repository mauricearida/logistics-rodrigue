const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// https://monjay.app.qore.com.au/customers/add
// admin@mjmezza.com.au
// Holden15

const {
  runsRoute,
  authRoute,
  usersRoute,
  routeRoute,
  billersRoute,
  productsRoute,
  costumersRoute,
  promotionsRoute,
  categoriesRoute,
  deliveryOccurRoute,
  paymentmethodRoute,
} = require("./routes");

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

app.use("/api/auth", authRoute); //
app.use("/api/runs", runsRoute);
app.use("/api/users", usersRoute); //
app.use("/api/routes", routeRoute);
app.use("/api/biller", billersRoute);
app.use("/api/products", productsRoute); //
app.use("/api/costumers", costumersRoute);
app.use("/api/promotion", promotionsRoute);
app.use("/api/categories", categoriesRoute); //
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
