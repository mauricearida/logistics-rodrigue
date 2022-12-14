const Vehicle = require("../models/Vehicle");
const { log } = require("../helpers/Loger");

exports.createVehicle = async (req, res) => {
  try {
    const { plate } = req.body;
    const newVehicle = new Vehicle(req.body);
    const isNewPlateVehicle = await Vehicle.isThisPlateInUse(plate);
    if (!isNewPlateVehicle)
      return res.status(400).json({
        success: false,
        message:
          "This plate is already in use, try register with a different one",
      });
    const savedVehicle = await newVehicle.save();
    res.status(200).json(savedVehicle);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { plate } = req.body;
    const isNewPlateVehicle = await Vehicle.isThisPlateInUse(plate);
    if (!isNewPlateVehicle)
      return res.status(400).json({
        success: false,
        message:
          "This plate is already in use, try register with a different one",
      });
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedVehicle) {
      res.status(200).json(updatedVehicle);
    } else {
      res.status(404).json("No vehicle was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json("Vehicle has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json("No vehicle was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ _id: -1 });
    if (vehicles) {
      res.status(200).json(vehicles);
    } else {
      return res.status(200).json("No vehicles found");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
