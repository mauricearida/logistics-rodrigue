const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role == 1) {
      next();
    } else {
      res.status(403).json("You should be an admin to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  let token = req.headers.token;
  if (!token) return res.status(404).json("Only admins can do that !");
  verifyToken(req, res, () => {
    if (req.user.role == 1) {
      next();
    } else {
      res.status(403).json("Only admins can do such operations!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
