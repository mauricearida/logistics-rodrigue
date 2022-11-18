const router = require("express").Router();

const {
  validateUserSignup,
  validateUserLogin,
  validate,
} = require("../middlewares/validators");
const { signup, login } = require("../controllers/auth");

router.route("/register").post(validateUserSignup, validate, signup);
router.route("/login").post(validateUserLogin, validate, login);

module.exports = router;
