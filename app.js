const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
const authRoute = require("./routess/auth");
const runsRoutee = require("./routess/runs");
const billersRoutee = require("./routess/biller");
const usersRoutee = require("./routess/users");
const routeRoutee = require("./routess/routes");
const ordersRoutee = require("./routess/orders");

// https://monjay.app.qore.com.au/customers/add
// admin@mjmezza.com.au
// Holden15

const {
  productsRoute,
  customersRoute,
  promotionsRoute,
  categoriesRoute,
  deliveryOccurRoute,
  paymentmethodRoute,
} = require("./routes");

dotenv.config();

const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(cors());
app.use(express.json());
app.use(compression());

app.use("/api/auth", authRoute);
app.use("/api/runs", runsRoutee);
app.use("/api/biller", billersRoutee);
app.use("/api/users", usersRoutee);
app.use("/api/routes", routeRoutee);
//======================
app.use("/api/orders", ordersRoutee);
//======================
app.use("/api/products", productsRoute);
app.use("/api/customers", customersRoute);
app.use("/api/promotion", promotionsRoute);
app.use("/api/categories", categoriesRoute);
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
