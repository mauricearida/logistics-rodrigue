const router = require("express").Router();
const {
  getOrdersByUserId,
  getSalesByDay,
} = require("../controllers/statistics");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const { validateMongoId, validate } = require("../middlewares/validators");

router.route("/day").post(verifyTokenAndAdmin, getSalesByDay);
router
  .route("/getorderbyuser/:id")
  .get(verifyTokenAndAdmin, validateMongoId, validate, getOrdersByUserId);

module.exports = router;
