const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const { catchAsync } = require("../utils/error handling/catchAsync");
const AppError = require("../utils/error handling/appError");
const { User } = require('../users/schema');
const {sendEmail} = require('../utils/mailer');
const { tokenCreator } = require('../utils/route tools/tokenCreator');

async function routeGuard(req, res, next){
    // the err message is the same on purpose
    const getTheF_Out = new AppError('Invalid or Inexistent credentials',401);

    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    };
    if (!token) return next(getTheF_Out );
    
    const payload = await promisify(jwt.verify)(token,process.env.JWT_KEY);
    const user = await User.findById(payload.id);

    if (!user) return next( getTheF_Out);
    if ( ! user.hasSamePasswordSince(payload.iat) )return next( getTheF_Out ); 
    req.user = user; // further use...
    next(); 
};

function allowOnly( ...roles ){
    return ( req, res, next)=>{
        if ( !roles.includes(req.user.role) ){
            return next(new AppError('Access Denied!! Not enough permissions',403))
        }
        return next();
    }    
};

async function passwordForgotten(req, res, next) {
    const email  = req.body.email;
    if (!email) return next(new AppError('please provide a valid email',400));
    
    const user = await User.findOne({email});
    if (!user) return next(new AppError('This email does not belong to any knwon user, please provide a registered email ',404));
    
    const resetToken = user.createResetToken();
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/portal/reset-password/${resetToken}` // implementation may change
    
    const message = `
    Please do not reply to this message
    This is an automated email due a password recovery request 
    If you did not make such request, please ignore this email.
    \nOtherwise submit the new password to the URL: 
    \n${resetURL} 
    \nwithin the next 10 minutes`;

    try{
        await sendEmail({
            email: user.email,
            subject:'Password Reset Token',
            message
        })
    
        return res.status(200).json({
            status:'success',
            message:' a reset Token has been sent to your email. please check it'
        })

    }catch(error){
        user.resetToken = undefined,
        user.resetTokenExpiration = undefined,

        await user.save();
        return next(new AppError(`${error.message}`,500));
    }
};

async function passwordRecovery(req, res, next) {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne( {resetToken: hashedToken, resetTokenExpiration: { $gt: Date.now() } } );
    //the expiration is tested on the query.
    if (!user) return next(new AppError('Invalid Or Expired Token, please get a new one',401));

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    const token = tokenCreator(user._id);
    return res.status(200).json({
        status:'success',
        id:user._id,
        token
    });


};

module.exports.routeGuard = catchAsync(routeGuard)
module.exports.allowOnly = allowOnly
module.exports.passwordForgotten = catchAsync(passwordForgotten)
module.exports.passwordRecovery = catchAsync(passwordRecovery)