const AppError = require("./appError");

const illegalDataError = new AppError('You can not change sensitive data throw this resource,please check your input',400);
module.exports = illegalDataError; 