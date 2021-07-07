const { catchAsync } = require('../../tools/error.handling/catchAsync');

module.exports.paramValidator = catchAsync(async function (req, res, next, value){
    // todo implement param validation
    next()
},'joi')
