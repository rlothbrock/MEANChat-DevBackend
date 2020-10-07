const AppError = require("./appError");

const geoLocationError = new AppError('Invalid geolocation data: coordinates or distance or unit, please check your input',400);
module.exports = geoLocationError; 