exports.bodyFilter =function(request, ...allowedFields){
    const filtered = Object.create({});
    for (let field of allowedFields){
        if( !!request.body[field] ){
        	filtered[field] = request.body[field];
        }
    };
    return filtered 
};