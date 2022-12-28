const router = require("express").Router();
const {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getAllOrders,
  sendUserToCreateOrder,
} = require("../controllers/orders");
const {
  validateMongoId,
  validate,
  creatingOrder,
} = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router
  .route("/senduseridfororder/:id")
  .post(verifyTokenAndAdmin, sendUserToCreateOrder);

router
  .route("/")
  .post(verifyTokenAndAdmin, creatingOrder, validate, createOrder)
  .get(verifyTokenAndAdmin, getAllOrders);

router
  .route("/:id")
  .put(verifyTokenAndAdmin, validateMongoId, validate, updateOrder)
  .delete(verifyTokenAndAdmin, validateMongoId, validate, deleteOrder)
  .get(validateMongoId, getOrder);

module.exports = router;
