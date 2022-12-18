const router = require("express").Router();
const {
  getAllAdmins,
  getAllUsers,
  getAllDrivers,
} = require("../controllers/getPeople");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/admins").get(verifyTokenAndAdmin, getAllAdmins);
router.route("/users").get(verifyTokenAndAdmin, getAllUsers);
router.route("/drivers").get(verifyTokenAndAdmin, getAllDrivers);

module.exports = router;
