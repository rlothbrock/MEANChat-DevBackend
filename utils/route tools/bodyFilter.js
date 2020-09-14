exports.bodyFilter =function(request, ...allowedFields){
    const filtered = Object.create({});
    for (let field of allowedFields){
        filtered[field] = request.body[field]
    };
    return filtered 
};