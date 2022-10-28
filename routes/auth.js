const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");

const {
  validateUserSignup,
  validateUserLogin,
  validate,
} = require("../middlewares/validator");

const router = require("express").Router();

//REGISTER
router.post("/register", validateUserSignup, validate, async (req, res) => {
  const { name, email, phonenumber } = req.body;

  //check if email is duplicate
  const isNewEmailUser = await User.isThisEmailInUse(email);
  if (!isNewEmailUser)
    return res.status(400).json({
      success: false,
      message: "This email is already in use, try sign-in with a different one",
    });
  //check if name is duplicate
  const isNewNameUser = await User.isThisNameInUse(name);
  console.log(`isNewNameUser`, isNewNameUser);
  if (!isNewNameUser)
    return res.status(400).json({
      success: false,
      message:
        "This name is already in use, please sign in with a different name",
    });

  const newUser = new User({
    name: name,
    email: email,
    phonenumber: phonenumber,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", validateUserLogin, validate, async (req, res) => {
  try {
    const user = await User.findOne({
      name: req.body.name,
    });

    !user && res.status(401).json("Wrong User Name");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;
    if (originalPassword != inputPassword)
      return res.status(401).json("Wrong Password");

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    // let AuDate = new Date().toLocaleString("en-US", {
    //   timeZone: "Australia/Sydney",
    // });

    user.lastlogin = Date.now();

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
