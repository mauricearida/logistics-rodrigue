const router = require("express").Router();

const {
  validateSignup,
  validateLogin,
  validate,
} = require("../middlewares/validators");
const { signup, login } = require("../controllers/auth");

router.route("/register").post(validateSignup, validate, signup);
router.route("/login").post(validateLogin, validate, login);

module.exports = router;
