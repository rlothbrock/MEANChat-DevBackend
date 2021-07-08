const jwt = require('jsonwebtoken');

module.exports.jwtSign = function(userId){
    return jwt.sign( { id: userId },process.env.JWT_KEY,{expiresIn: process.env.JWT_EXPIRATION} )
};

