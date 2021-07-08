/* todo create here validation middleware for:
    params
    body
    divide attending to routes, even if it implies some duplication
*/

const { body } = require('express-validator')

function signupValidation(req, res, next){
    body('email','email is not valid').isEmail({
    })
}

