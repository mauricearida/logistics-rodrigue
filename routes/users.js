const router = require("express").Router();
const {
  getUser,
  updateUser,
  getAllUsers,
  deteleUser,
} = require("../controllers/users");
const { validateMongoId, validate } = require("../middlewares/validators");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

//=============================

router
  .route("/:id")
  .get(verifyTokenAndAdmin, getUser)
  .put(verifyTokenAndAuthorization, validateMongoId, validate, updateUser)
  .delete(verifyTokenAndAdmin, validateMongoId, validate, deteleUser);

router.route("/").get(verifyTokenAndAdmin, getAllUsers);

module.exports = router;
