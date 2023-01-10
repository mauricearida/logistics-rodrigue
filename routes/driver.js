const router = require("express").Router();
const {
  createDriver,
  updateDriver,
  deleteDriver,
  getDriver,
  getAllDrivers,
} = require("../controllers/driver");
const {
  validateName,
  validateMongoId,
  validate,
  validatePhone,
} = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router
  .route("/")
  .post(
    verifyTokenAndAdmin,
    validatePhone,
    validateName,
    validate,
    createDriver
  )
  .get(verifyTokenAndAdmin, getAllDrivers);

router
  .route("/:id")
  .put(verifyTokenAndAdmin, validateMongoId, validate, updateDriver)
  .delete(verifyTokenAndAdmin, validateMongoId, validate, deleteDriver)
  .get(validateMongoId, getDriver);

module.exports = router;
