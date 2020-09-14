const AppError = require("./appError");

const badRequestError = new AppError('Invalid data, please check your input',400);
module.exports = badRequestError; 