const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const { validateMongoId } = require("../middlewares/validator");
const User = require("../models/User");

const CryptoJS = require("crypto-js");

const router = require("express").Router();

//UPDATE
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  validateMongoId,
  async (req, res) => {
    const { name, username, email, password, phonenumber } = req.body;
    if (!name && !username && !email && !password && !phonenumber) {
      return res
        .status(400)
        .json("Please enter at least one valid parameter !");
    }
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//DELETE
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  validateMongoId,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET USER
router.get(
  "/find/:id",
  verifyTokenAndAuthorization,
  validateMongoId,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET ALL USER

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (!page || !limit)
      return res
        .status(400)
        .json("the required query parameters are : page and limit");
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS
//not used
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
