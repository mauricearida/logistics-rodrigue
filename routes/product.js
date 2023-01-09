const router = require("express").Router();

const {
  createproduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getproductsPaginated,
  findProductsByTextSearch,
  getTopOrderedProducts,
  getTopProductsByCategory,
} = require("../controllers/products");
const {
  validateMongoId,
  validateCategoryId,
  validate,
} = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/find").post(verifyTokenAndAdmin, findProductsByTextSearch);
router.route("/get-top").get(verifyTokenAndAdmin, getTopOrderedProducts);
router
  .route("/get-top-by-category")
  .get(verifyTokenAndAdmin, getTopProductsByCategory);

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
