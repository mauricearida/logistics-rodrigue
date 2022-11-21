const Run = require("../models/Run");
const { log } = require("../helpers/Loger");

exports.createRun = async (req, res) => {
  const newRun = new Run(req.body);
  try {
    const savedRun = await newRun.save();
    res.status(200).json(savedRun);
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.updateRun = async (req, res) => {
  try {
    const updatedRun = await Run.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedRun) {
      res.status(200).json(updatedRun);
    } else {
      res.status(404).json("No run was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.deleteRun = async (req, res) => {
  try {
    await Run.findByIdAndDelete(req.params.id);
    res.status(200).json("Run has been deleted...");
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getRun = async (req, res) => {
  try {
    const run = await Run.findById(req.params.id);
    if (run) {
      res.status(200).json(run);
    } else {
      res.status(404).json("No run was found with this id !");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};

exports.getAllRuns = async (req, res) => {
  try {
    const runs = await Run.find();
    if (runs) {
      res.status(200).json(runs);
    } else {
      return res.status(200).json("No runs found");
    }
  } catch (err) {
    await log(err);
    res.status(500).json(err);
  }
};
