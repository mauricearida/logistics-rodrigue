const router = require("express").Router();
const { getAllAdmins, getAllUsers } = require("../controllers/getPeople");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/admins").get(verifyTokenAndAdmin, getAllAdmins);
router.route("/users").get(verifyTokenAndAdmin, getAllUsers);

module.exports = router;
