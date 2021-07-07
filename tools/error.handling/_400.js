const AppError = require("./appError");

module.exports.illegalDataError = new AppError('You can not change sensitive data throw this resource,please check your input',400);
module.exports.badRequestError = new AppError('Invalid data, please check your input',400);
module.exports.lackOfPermissionsError =  new AppError('Invalid or Expired Credentials, please log in again',401);
module.exports.notFoundError = new AppError('the requested resource was not found on this server!!!',404);
