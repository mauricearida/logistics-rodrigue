const router = require("express").Router();

const {
  updateCount,
  createproduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getproductsPaginated,
  findProductsByTextSearch,
  getTopOrderedProducts,
} = require("../controllers/products");
const {
  validateMongoId,
  validateCategoryId,
  validate,
} = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/updatecount").put(verifyTokenAndAdmin, updateCount);
router.route("/find").post(verifyTokenAndAdmin, findProductsByTextSearch);
router.route("/get-top").get(verifyTokenAndAdmin, getTopOrderedProducts);

router
  .route("/")
  .post(verifyTokenAndAdmin, validateCategoryId, validate, createproduct)
  .get(getproductsPaginated);

router
  .route("/:id")
  .put(verifyTokenAndAdmin, validateMongoId, validate, updateProduct)
  .delete(verifyTokenAndAdmin, validateMongoId, deleteProduct)
  .get(verifyTokenAndAdmin, validateMongoId, getProduct);

module.exports = router;
