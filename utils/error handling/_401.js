const AppError = require("./appError");

const lackOfPermissionsError =  new AppError('Invalid or Expired Credentials, please log in again',401);
module.exports = lackOfPermissionsError; 