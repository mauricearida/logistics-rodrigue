const router = require("express").Router();
const {
  getAllAdmins,
  getAllUsers,
  getAllStaff,
} = require("../controllers/getPeople");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/admins").get(verifyTokenAndAdmin, getAllAdmins);
router.route("/users").get(verifyTokenAndAdmin, getAllUsers);
router.route("/staffmembers").get(verifyTokenAndAdmin, getAllStaff);

module.exports = router;
