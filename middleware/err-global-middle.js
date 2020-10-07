const AppError = require('../utils/error.handling/appError');

// error response env-based handlers
function sendDevErr(err, res) {
    const date_ = new Date().toLocaleString();
    console.error(date_, err);
    return res
    .status(err.statusCode)
    .json({
        date: date_,
        source: err.sourceErr,
        status:err.status,
        error: err,
        message: err.message,
        stack:err.stack
    })
}
function sendProdErr(err, res) {
    if(err.isOperational){
        return res
            .status(err.statusCode)
            .json({
                status:err.status,
                message: err.message
            })
    }else{
        console.error(new Date().toISOString(), err); // notify to webmaster
        return res.status(500).json({status:'error', message:'something went wrong!!'})
    }
}


// mongoose errors handlers
function castErrHandler(castErr) {
    return new AppError(`Invalid value ${castErr.value} for field ${castErr.path}`,400);
}
function mongoErrHandler(mongoErr) {
    return new AppError( 
        `Invalid value ${mongoErr.message.match(/(["'])(\\?.)*?\1/)[0]}. This value has already been used`,400);
}
function valErrHandler(valErr) {
    const value = Object.values(valErr.errors).map(i=>i.message).join('. ')
    return new AppError(`Invalid input: ${value}.`,400);
}


// joi errors handler
function joiErrHandler(error){
    let _message = "invalid user input. Reason:  ";
    const chk = Object.values(error.details).map( (item)=>{
            return item.context.details.filter( details => {
                if(! new RegExp(details.message).test(_message)){
                    if (_message.length > 32)_message += ' or '
                    _message += ` ${details.message}, `;
                }
            })
        })
    return new AppError(`${_message}`,400)
};


// JWT errors handlers
function jwtErrHandler(){
    return new AppError(`Invalid or Expired Token, please login again`,401);
}
function jwtExpiredErrHandler() {
    return new AppError('Invalid or Expired token, please login again',401)    
}

// prod environment error dispatcher
function dispatcher(err_, res){
    let error = Object.create(err_); 
    if (err_.sourceErr === 'joi'){ error =  joiErrHandler(err_) }
    else if (err_.sourceErr === 'other'){
        if(err_.name === 'CastError') error = castErrHandler(err_); 
        if(err_.name === 'ValidationError') error = valErrHandler(err_); 
        if(err_.code === 11000 ) error = mongoErrHandler(err_); 
        if(err_.name === 'JsonWebTokenError') error = jwtErrHandler();    
        if(err_.name === 'TokenExpiredError') error = jwtExpiredErrHandler();    
    }
    return sendProdErr(error,res)
}

exports.errHandler = (err_, req, res, next)=>{
    if(err_.sourceErr){err_.statusCode = 400};
    err_.statusCode = err_.statusCode || (err_.isOperational ? 400 : 500);
    err_.status = err_.status || (`${err_.statusCode}`.startsWith('4') ? 'fail' : 'error');  
    if(process.env.NODE_ENV === 'development'){
       return sendDevErr(err_,res)
    }else if(process.env.NODE_ENV === 'production'){
        return dispatcher(err_, res);
    }


}