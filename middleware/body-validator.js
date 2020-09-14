const AppError = require("../utils/error handling/appError")

const {catchAsync} = require('../utils/error handling/catchAsync');

exports.bodyValidator = (schema)=>{
    return catchAsync(async (req, res, next)=>{
        await schema.validateAsync({...req.body})
        next()
    },'joi')
}
