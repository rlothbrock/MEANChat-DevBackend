
const {catchAsync} = require('../../tools/error.handling/catchAsync');

exports.bodyValidator = (_)=>{
    return catchAsync(async (req, res, next)=>{
        // not yet implemented
        next()
    },'joi')
}
