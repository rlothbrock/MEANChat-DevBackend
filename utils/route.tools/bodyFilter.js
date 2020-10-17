exports.bodyFilter =function(request, ...allowedFields){
    const filtered = Object.create({});
    for (let field of allowedFields){
        console.log('testing with field:',field);
        if( !!request.body[field]){
            console.log('condicion evaluada de true, asignando valor',request.body[field])
        	filtered[field] = request.body[field];
        }
    };
    console.log('filtered al salir de bodyfilter:',filtered);
    return filtered 
};