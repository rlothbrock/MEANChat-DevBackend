const { catchAsync } = require("../error.handling/catchAsync");
const { options } = require("joi");


module.exports.deleteOne = (Model,options) => catchAsync(async (req, res, next)=>{
    if (!options.message) options.message = 'deleted successfully'
    const deleted = await Model.findByIdAndDelete(req.params.id);

    if(!deleted){
        return next(notFoundError);
    }

    return res.status(204).json({
        status:"success",
        data:{deleted},
        message: options.message
    })
})

module.exports.patchOne = (Model,options) => catchAsync(async (req, res, next)=>{
    // use only for not sensitive data...
    if (!options.message) options.message = 'updated succesfully'
    const docPatched = await Model.findByIdAndUpdate(
        req.params.id,req.body,
        {runValidators: true,new:true}
    );
    
    if (!docPatched){
        return next(notFoundError);
    }

    return res.status(201).json({
        status:'success',
        data:{ data: docPatched},
        message:options.message
    })
});

module.exports.getOne = (model, options) => catchAsync(async (req, res, next)=>{
    const  _resource = model.findById(req.params.id);
    if (!options.message) options.message = 'resource sent'
    if (!options.populate){  
        resource = await _resource;
    }
    if (options.populate){
        resource = await _resource.populate({
            path: options.populate.path,
            select: options.populate.select
        });
    } 
    if (!resource) next(notFoundError);
        return res.status(200).json({
            status:'succes',
        data:{
            data: resource
        },
        message:options.message
        })

});

module.exports.getMany = (Model,options) => catchAsync(async (req, res, next )=>{
    if(!options.message) options.message = 'all coincidences sent'
    const docs = await Model.find().select('-__v');
    return res.status(200).json({
        status:'succes',
        data:{data: docs},
        message: options.message
    })
});

module.exports.postOne = (Model, options) => catchAsync(async (req, res, next)=>{
    if (!options.message) options.message ='created successfully' 
    let allowedFields = Object.create(null);
    if (!options.fields){ 
        allowedFields = req.body
    }else{
        options.fields.forEach(field => allowedFields[field] = req.body[field]);
    }
    const newDoc = await Model.create(allowedFields);
    
    return res.status(201).json({
        status:'success',
        data:{id: newDoc._id},
        message:options.message
    })
    
});
