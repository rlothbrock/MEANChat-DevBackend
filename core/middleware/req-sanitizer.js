const { body } = require('express-validator');


module.exports.bodySanitizer = async function (req, res, next){
    if (process.env.NODE_ENV === 'development') console.log('sanitizing input');
    if(req.body.email){
        await body('email')
            .normalizeEmail({all_lowercase:true, gmail_remove_dots:false})
            .run(req)
    }
    if(req.body.username){
        await body('username')
            .trim()
            .escape()
            .run(req)
    }
    if(req.body.password){
        await body('password')
            .trim()
            .escape()
            .run(req)
    }
    if(req.body['oldPassword']){
        await body('oldPassword')
            .trim()
            .escape()
            .run(req)
    }
    if(req.body['updatedPassword']){
        await body('updatedPassword')
            .trim()
            .escape()
            .run(req)
    }
    if (req.body['role']){
        console.log('sanitizing role')
        await body('role')
            .replace(['admin'], 'user')
            .run(req)
    }
    next()
}

