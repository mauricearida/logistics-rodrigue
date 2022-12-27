const router = require("express").Router();
const {
  createCostumer,
  updateCostumer,
  deleteCostumer,
  getCostumer,
  getCostumerPaginatedArchived,
  findCustomerByTextSearch,
} = require("../controllers/costumer");
const {
  validateCreateCustomer,
  validateMongoId,
  validate,
} = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/find").post(verifyTokenAndAdmin, findCustomerByTextSearch);
router
  .route("/")
  .post(verifyTokenAndAdmin, validateCreateCustomer, validate, createCostumer)
  .get(verifyTokenAndAdmin, getCostumerPaginatedArchived);

router
  .route("/:id")
  .put(verifyTokenAndAdmin, validateMongoId, validate, updateCostumer)
  .delete(verifyTokenAndAdmin, validateMongoId, validate, deleteCostumer)
  .get(validateMongoId, validate, getCostumer);

module.exports = router;
