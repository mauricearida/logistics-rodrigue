const { verifyTokenAndAdmin } = require("./verifyToken");
const { validateMongoId, creatingOrder } = require("../middlewares/validators");
const Order = require("../models/Order");
const router = require("express").Router();

// {

// }

//CREATE ROUTE
router.post("/", verifyTokenAndAdmin, creatingOrder, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.log(`err`, err);
    res.status(500).json(err);
  }
});

//UPDATE ROUTE
router.put("/:id", verifyTokenAndAdmin, validateMongoId, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ROUTE
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  validateMongoId,
  async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json("Order has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET Route
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Routes
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders) {
      res.status(200).json(orders);
    } else {
      return res.status(200).json("No orders found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
