
// the conditional execution was intended for dealing with differences on error format 
// if another validator used change the strings allowed
exports.catchAsync = (handler)=>{
    return (req, res, next) => {
            handler(req, res, next).catch( err => {
                err.sourceErr = 'caught-exception';
                next(err)} );
    }
};


