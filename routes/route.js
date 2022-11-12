const { verifyTokenAndAdmin } = require("./verifyToken");
const {
  validateMongoId,
  creatingRoute,
  validate,
} = require("../middlewares/validators");
const Route = require("../models/Route");
const router = require("express").Router();

// {

// }

//CREATE ROUTE
router.post(
  "/",
  verifyTokenAndAdmin,
  creatingRoute,
  validate,
  async (req, res) => {
    const newRoute = new Route(req.body);
    try {
      const savedRoute = await newRoute.save();
      res.status(200).json(savedRoute);
    } catch (err) {
      console.log(`err`, err);
      res.status(500).json(err);
    }
  }
);

//UPDATE ROUTE
router.put(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  validate,
  async (req, res) => {
    try {
      const updatedRoute = await Route.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedRoute);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//DELETE ROUTE
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  async (req, res) => {
    try {
      await Route.findByIdAndDelete(req.params.id);
      res.status(200).json("Route has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET Route
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    res.status(200).json(route);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Routes
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find();
    if (routes) {
      res.status(200).json(routes);
    } else {
      return res.status(200).json("No routes found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
