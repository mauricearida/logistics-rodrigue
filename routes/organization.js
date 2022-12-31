const router = require("express").Router();
const {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganization,
  getAllOrganizations,
} = require("../controllers/organization");

const { validateMongoId, validate } = require("../middlewares/validators");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router
  .route("/")
  .post(verifyTokenAndAdmin, createOrganization)
  .get(verifyTokenAndAdmin, getAllOrganizations);

router
  .route("/:id")
  .delete(verifyTokenAndAdmin, validateMongoId, validate, deleteOrganization)
  .put(verifyTokenAndAdmin, validateMongoId, validate, updateOrganization)
  .get(validateMongoId, getOrganization);

module.exports = router;
