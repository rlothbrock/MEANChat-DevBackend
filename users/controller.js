const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const path = require('path');

const AppError = require('../utils/error handling/appError');
const lackOfPermissionsError = require('../utils/error handling/_401');
const illegalDataError = require('../utils/error handling/_400.illegal');
const notFoundError = require('../utils/error handling/_404');
//const badRequestError = require('../../utils/error handling/_400');

const createHandlerFor = require('../utils/route tools/handlersFactory');
const {tokenCreator} = require('../utils/route tools/tokenCreator');
const { User } = require('./schema');
const { catchAsync } = require('../utils/error handling/catchAsync');
const { bodyFilter } = require('../utils/route tools/bodyFilter');

async function imageResizing(req, res, next){
    try {    
        if (!req.file) return next();
        req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
        
        await sharp(req.file.buffer)
        .resize(200,200)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(path.join(__dirname,'../../static/img',req.file.filename));
        next();
    } catch (error) {
        return new AppError('oops....',500);
    }
};

async function multipleImagesResizing(req, res, next){
    if (!req.files) return next();

    //1) single image field
        const resourceImageName = `resourceName-${req.params.id}-${Date.now()}-imagePurpose.jpeg`;

        await sharp(req.files.fieldName[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(path.join(__dirname,'../../static/img',resourceImageName));

        req.body.fieldName = resourceImageName;
        
    //2) multiple image field
        req.body.fieldmultiName = [];
        const pendingImages = req.files.fieldmultiName.map(async (file,index) =>{
            const resourceImageName = `resourceName-${req.params.id}-${Date.now()}-imagePurpose${index+1}.jpeg`;

            await sharp(file.buffer)
            .resize(2000,1333)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(path.join(__dirname,'../../static/img',resourceImageName));
        
            req.fieldmultiName.push(resourceImageName);
        });

        await Promise.all(pendingImages);
        next()

     

};

async function passwordUpdating(req, res, next){
    
    const { oldPassword, updatedPassword } = req.body;
    if(!oldPassword || !updatedPassword || (oldPassword === updatedPassword) ) {
        return next(new AppError('Invalid input, please provide both the current and new password. Don\'t use the same ',400))
    };
    
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    };
    if (!token) return next(lackOfPermissionsError);
    
    const payload = await promisify(jwt.verify)(token,process.env.JWT_KEY);

    const user = await User.findById(payload.id);
    if ( !user || !( await user.verifyPassword(oldPassword) ) ) return next(lackOfPermissionsError);

    user.password = updatedPassword;
    await user.save();

    const newToken = tokenCreator(user._id); 

    return res.status(200).json({
        status:'success',
        token: newToken
    })
};
async function profileUpdating(req, res, next){
    // not allowed for password role or email, or any other sensitive field
    if (req.body.password || req.body.role || req.body.email ) return next(illegalDataError)
    let filtered = bodyFilter(req,'username');
    if (req.file) filtered.photo = req.file.name;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filtered,
        {runValidators: true, new:true}
    );

    if (!updatedUser) return next(notFoundError);

    return res.status(200).json({
        status:'success',
        data:{data: updatedUser},
        message: 'user successfully updated'
    })
};
async function profileDeleting(req, res, next){
    await User.findByIdAndUpdate(req.user._id,{active: false});
    
    res.status(204).json({
        status: 'success',
        message:'account successfully removed'
    })
};
function useTokenForSetParams(req, res, next){
    req.params.id = req.user._id
    next()
}
//catchAsync wraps the try-catch block logic
module.exports.passwordUpdating = catchAsync(passwordUpdating);
module.exports.profileUpdating = catchAsync(profileUpdating);
module.exports.profileDeleting = catchAsync(profileDeleting);
module.exports.useTokenForSetParams = useTokenForSetParams;
module.exports.getMe = createHandlerFor.getOne(User,{message:'user successfully sent'});
module.exports.getUser = createHandlerFor.getOne(User,{message:'user successfully sent'});
module.exports.getUsers = createHandlerFor.getMany(User,{message: 'users sent !!'});
module.exports.postUser = createHandlerFor.postOne(User,{message:'user created successfully'});
module.exports.patchUser = createHandlerFor.patchOne(User,{message:'changes saved succesfully'});
module.exports.deleteUser = createHandlerFor.deleteOne(User,{message: 'user deleted succesfully'});
