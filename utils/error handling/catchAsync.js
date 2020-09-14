
const AppError = require("./appError");

// the conditional execution was intended for dealing with differences on error format 
// between joi and mongoose in further middleware
// if another validator used change the strings allowed
exports.catchAsync = (handler,source='other')=>{
    if(source){
        if (source !== 'joi' && source !== 'other'){
            return new AppError('allowed sources are:  joi || other ',500)
        };
    }
    return (req, res, next) => {
        handler(req, res, next).catch( err => {
            handler(req, res, next).catch( err => {
                err.sourceErr = source;
                next(err)} ); 
        } );
    }

};  


