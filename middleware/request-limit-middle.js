const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15*60*1000,
    max:100,
    message:'too many requests, try in a few minutes'
});