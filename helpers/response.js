const success = (res, data) => {
  return res.status(200).json({
    success: true,
    data: data,
  });
};

const error = (res, message, data = null) => {
  return res.status(400).json({
    success: false,
    error: "Error",
    message: message,
    data: data,
  });
};

const unauthorized = (res, message) => {
  return res.status(401).json({
    success: false,
    error: "Unauthorized",
    message: message,
  });
};

const forbidden = (res) => {
  return res.status(403).json({
    success: false,
    error: "Forbidden, you don't have permission to access this resource.",
  });
};

const serverError = (res, message) => {
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: message,
  });
};

const notFound = (res, message) => {
  return res.status(404).json({
    success: false,
    error: "Not Found",
    message: message,
  });
};

const badRequest = (res, message) => {
  return res.status(400).json({
    success: false,
    error: "Bad Request",
    message: message,
  });
};

module.exports = {
  success,
  error,
  unauthorized,
  forbidden,
  serverError,
  notFound,
  badRequest,
};
