const {catchAsync} = require('./../../tools/error.handling/catchAsync')
const {validationResult} = require("express-validator");
const {User} = require("../../endpoints/users/schema");
const {body, cookie, header, param} = require("express-validator");

const username_msg = 'username should be 5 to 50 alphanumeric Characters'
const email_msg = 'please use a unique and valid email'
const password_msg = 'password should be 12 characters at least,and must have number,' +
    'uppercase,lowercase,symbol'


async function loginValidatorFunc(req, res, next){



    await body('email',email_msg)
        .isEmail().bail()
        .run(req)
    await body('password',password_msg)
        .isStrongPassword(
            {minLowercase:1,minLength:12,minNumbers:1,minSymbols:1,minUppercase:1}
        ).run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return Promise.reject(errors.array())
    }
    else{
        next()
    }
}
async function signUpValidatorFunc(req, res, next){
    await body('username',username_msg)
        .isLength({min: 5, max: 50})
        .isAlphanumeric()
        .run(req);
    await body('email',email_msg)
        .isEmail().bail()
        .custom(async value => {
            const matches = await User.findOne({'email': value}).countDocuments();
            if (matches > 0){
                throw Error('email already exists')
            }
        } )
        .run(req)
    await body('password',password_msg)
        .isStrongPassword(
            {minLowercase:1,minLength:12,minNumbers:1,minSymbols:1,minUppercase:1}
        ).run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return Promise.reject(errors.array())
    }
    else{
        next()
    }

}
async function cookieValidatorFunc(req, res, next){
    //should test because cookie contains also a non hashed chunk
    await cookie().isHash('sha256').run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return Promise.reject(errors.array())
    }
    else{
        next()
    }
}
async function paramValidatorFunc(req, res, next){
        console.log('reading param_name:'+req.params.id)
        if (req.params.id) {
            await param('id').isMongoId().run(req)
        }
        if (req.params.token) {
            await param('token').isHash("sha256").run(req)
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return Promise.reject(errors.array())
        }
        else{
            next()
        }
}
async function headerValidatorFunc(req, res, next){
    await header('authorization').isHash("sha256")
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return Promise.reject(errors.array())
    }
    else{
        next()
    }
}

module.exports.loginValidator = catchAsync(loginValidatorFunc)
module.exports.signUpValidator = catchAsync(signUpValidatorFunc)
module.exports.cookieValidator = catchAsync(cookieValidatorFunc)
module.exports.headerValidator = catchAsync(headerValidatorFunc)
module.exports.paramValidator = catchAsync(paramValidatorFunc)
