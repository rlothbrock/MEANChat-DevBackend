const jwt = require('jsonwebtoken');

const AppError = require('../utils/error handling/appError');

const { User } = require('../users/schema'); 
const { catchAsync } = require('../utils/error handling/catchAsync');
const { tokenCreator } = require('../utils/route tools/tokenCreator');

function tokenSender(user, statusCode, res) {
    const token = tokenCreator(user._id); 
    const cookieExpiration = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION *24*3600*1000);
    const cookieOptions = {
        expires: cookieExpiration,
        secure: process.env.NODE_ENV === 'production' ? true : undefined,
        httpOnly:true
    }
    res.cookie('jwt',token, cookieOptions);
    
    return res.status(statusCode).json({
        status:'success',
        token
    })
}

async function signupHandler(req, res, next){
    const newUser = await User.create({
        username:req.body.username,
        email: req.body.email,
        password: req.body.password ,
        role: req.body.role
    });
    
    return tokenSender(newUser,201,res);
};
async function loginHandler(req, res, next){
    const { email, password } = req.body;

    if(!email || !password){
        const error = new AppError('email and password are required',400);
        return next(error);
    };
    const user = await User.findOne({email});
    if (!user || !(await user.verifyPassword(password)) ){
        const error = new AppError('invalid credentials',401);
        return next(error)
    }
    return tokenSender(user,200,res);
};



exports.signup = catchAsync(signupHandler);
exports.signin = catchAsync(loginHandler);
