const router = require("express").Router();

const {
  updateCount,
  createproduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getproductsPaginated,
} = require("../controllers/products");
const {
  validateMongoId,
  validateMongoCategoryId,
  validate,
} = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

//=====================================

router.route("/updatecount").put(verifyTokenAndAdmin, updateCount);

router
  .route("/")
  .post(verifyTokenAndAdmin, validateMongoCategoryId, validate, createproduct)
  .get(getproductsPaginated);

router
  .route("/:id")
  .put(verifyTokenAndAdmin, validateMongoId, validate, updateProduct)
  .delete(verifyTokenAndAdmin, validateMongoId, deleteProduct)
  .get(verifyTokenAndAdmin, validateMongoId, getProduct);

module.exports = router;
