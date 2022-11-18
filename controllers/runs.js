const Run = require("../models/Run");

exports.createRun = async (req, res) => {
  const newRun = new Run(req.body);
  try {
    const savedRun = await newRun.save();
    res.status(200).json(savedRun);
  } catch (err) {
    console.log(`err`, err);
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
    res.status(200).json(updatedRun);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteRun = async (req, res) => {
  try {
    await Run.findByIdAndDelete(req.params.id);
    res.status(200).json("Run has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getRun = async (req, res) => {
  try {
    const run = await Run.findById(req.params.id);
    res.status(200).json(run);
  } catch (err) {
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
    res.status(500).json(err);
  }
};
