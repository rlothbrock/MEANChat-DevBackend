
// the conditional execution was intended for dealing with differences on error format 
// between joi and mongoose in further middleware
// if another validator used change the strings allowed
exports.catchAsync = (handler,source='other')=>{
    return (req, res, next) => {
        handler(req, res, next).catch( err_ => {
            handler(req, res, next).catch( err => {
                err.sourceErr = source;
                next(err)} ); 
        } );
    }
};  


