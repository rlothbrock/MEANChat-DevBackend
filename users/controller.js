const {promisify} = require('util');
const jwt = require('jsonwebtoken');


const AppError = require('../utils/error.handling/appError');
const lackOfPermissionsError = require('../utils/error.handling/_401');
const illegalDataError = require('../utils/error.handling/_400.illegal');
const notFoundError = require('../utils/error.handling/_404');
const badRequestError = require('./../utils/error.handling/_400');
const createHandlerFor = require('../utils/route.tools/handlersFactory');
const {tokenCreator} = require('../utils/route.tools/tokenCreator');
const { User } = require('./schema');
const { catchAsync } = require('../utils/error.handling/catchAsync');
const { bodyFilter } = require('../utils/route.tools/bodyFilter');
const { upload } = require('../utils/fileUploader');



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
    console.log('body a la entrada:',req.body);
    // not allowed for password role or email, or any other sensitive field
    if (req.body.password || req.body.role || req.body.email ) return next(illegalDataError)
    let filtered = bodyFilter(req,'username', 'photo');
    if (req.file) filtered.photo = req.file.filename;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filtered,
        {runValidators: true, new:true}
    ).populate('contacts','username email photo');

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

async function addContacts(req, res, next){
    const { newContacts } = req.body;
    if (!newContacts || typeof(newContacts) !== typeof([]) || newContacts.length === 0){
        return next(badRequestError);
    }
    const contacts = await User.manageContacts(
        req.user._id,
        newContacts,
        {action: 'add'}
    );  
    return res.status(200).json({
        status: 'success',
        data: { data: contacts },
        message: 'contacts successfully updated'
    });
}

async function deleteContacts(req, res, next){
    const { deletedContacts } = req.body;
    if (!deletedContacts || typeof(deletedContacts) !== typeof([]) || deletedContacts.length === 0){
        return next(badRequestError);
    }
    const contacts = await User.manageContacts(
        req.user._id,
        deletedContacts,
        {action: 'delete'}
    );
    return res.status(204).json({
        message: 'contacts deleted successfully',
        data: {data: contacts}
    })
}


//catchAsync wraps the try-catch block logic
module.exports.passwordUpdating = catchAsync(passwordUpdating);
module.exports.contactsUpdating = catchAsync(addContacts);
module.exports.contactsDeleting = catchAsync(deleteContacts);
module.exports.profileUpdating = catchAsync(profileUpdating);
module.exports.profileDeleting = catchAsync(profileDeleting);
module.exports.useTokenForSetParams = useTokenForSetParams;
module.exports.getMe = createHandlerFor.getOne(User,{
    message:'user successfully sent',
    populate:{path: 'contacts', select:'photo username email'}
});
module.exports.getUser = createHandlerFor.getOne(User,{message:'user successfully sent',populate:{path: 'contacts', select:'photo username email'}});
module.exports.getUsers = createHandlerFor.getMany(User,{message: 'users sent !!',populate:{path: 'contacts', select:'photo username email'}});
module.exports.postUser = createHandlerFor.postOne(User,{message:'user created successfully'});
module.exports.patchUser = createHandlerFor.patchOne(User,{message:'changes saved succesfully'});
module.exports.deleteUser = createHandlerFor.deleteOne(User,{message: 'user deleted succesfully'});
