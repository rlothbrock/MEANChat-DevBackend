const AppError = require("./appError");

const notFoundError = new AppError('the requested resource was not found on this server!!!',404);
module.exports = notFoundError; 