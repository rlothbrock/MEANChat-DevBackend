exports.bodyFilter =function(request, ...allowedFields){
    const filtered = Object.create({});
    for (let field of allowedFields){
        console.log('testing with field:',field);
        if( !!request.body[field]){
        	filtered[field] = request.body[field];
        }
    }
    return filtered
};
