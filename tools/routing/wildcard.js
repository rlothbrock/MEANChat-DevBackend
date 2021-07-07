const AppError = require('../error.handling/appError');
exports.wildcardHandler = (req, res, next)=>{
    const error = new AppError(`the requested url ${req.originalUrl} can't be found on this server!!`,404);
    next(error)
}