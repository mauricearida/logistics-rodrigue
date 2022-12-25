const Route = require("../models/Route");
const { log } = require("../helpers/Loger");

exports.createRoute = async (req, res) => {
  const newRoute = new Route(req.body);
  try {
    const savedRoute = await newRoute.save();
    res.status(200).json(savedRoute);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedRoute) {
      res.status(200).json(updatedRoute);
    } else {
      res.status(404).json("No route was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.status(200).json("Route has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getRouteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (route) {
      res.status(200).json(route);
    } else {
      res.status(404).json("No route was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ _id: -1 });
    const routeCount = await Route.countDocuments();
    let objectTosend = {
      routeCount,
      routes,
    };
    if (routes) {
      res.status(200).json(objectTosend);
    } else {
      return res.status(200).json("No routes found");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
