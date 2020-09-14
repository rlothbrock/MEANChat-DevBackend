const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const { catchAsync } = require('../utils/error handling/catchAsync');

const paramSchema = Joi.object({
    id:Joi.objectId()
})

module.exports.paramValidator = catchAsync(async function (req, res, next, value){
        await paramSchema.validateAsync({id: value})
        next()
},'joi');
