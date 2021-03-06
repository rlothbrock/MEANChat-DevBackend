// const childSchema = new Schema({ parentId: mongoose.ObjectId });
// The Mongoose ObjectId SchemaType.
// Used for declaring paths in your schema that should be MongoDB ObjectIds.
// Do not use this to create a new ObjectId instance, use mongoose.Types.ObjectId instead.
 
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const joiUserSchema = Joi.object({
    username:Joi.string()
    .required()
    .trim()
    .min(3)
    .max(25),
    email:Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim()
    .required(),
    password: Joi.string()
    .required()
    .min(8)
    .max(100)
    .trim(),
    role:Joi.string()
    .trim()
    
});

const joiRecoverSchema = Joi.object({
    email:Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim()
    .required(),
})

const joiLoginSchema = Joi.object({
    email:Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim()
    .required(),
    password: Joi.string()
    .required()
    .min(8)
    .max(20)
    .trim()
})

const joiContactsArraySchema = Joi.object({
    newContacts: Joi.array().min(1)
});
const joiSchema = Joi.alternatives([
    joiUserSchema,
    joiLoginSchema,
    joiRecoverSchema,
    joiContactsArraySchema])


const userSchema = new mongoose.Schema({
    photo:{
        type: String,
        default: 'user-default.png'
    },
    tokenExpiration:{
        type: Date,
        default: new Date(Date.now()+ 90*24*60*60*1000) 
    },
    active:{
        type: Boolean,
        default:true
    },
    username:{
        type: String,
        required: [true,'a username is required'],
        minlength: [3,'username too short, please use a 3 to 20 charachters username'],
        maxlength: [20,'username too long, please use a 3 to 20 charachters username'],
    },
    email:{
        type: String,
        required: [true,'an email is required'],
        unique: ['this email has already been used before. Use only unique emails'],
        validate:{
            validator:(input)=>{
                return /^.{3,25}@\w{3,10}.[a-z]{2,6}(.[a-z]{2,3})?$/.test(input)
            },
            message:'invalid email, please check your typo'
        }
    },
    password:{
        type:String,
        // select:false,   use this prop for avoiding password to show  
        required: [true,'a password is required'],
        minlength:[8,'password too short, please use a 8 to 100 charachters password'],
        maxlength:[100,'password too long, please use a 8 to 100 charachters password'],
        validate:{
            validator:(input)=>{
                return /\d+/.test(input) && /[A-Z]+/.test(input) && /[a-z]+/.test(input) &&  /\W+/.test(input) && !/\s+/.test(input)
            },
            message:'invalid password, please include lowercase, uppercase, symbols and digits'
        }
    },
    passwordChangedAt:{
        type: Date
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default:'user'
    },
    resetToken:{
        type:String
    },
    resetTokenExpiration:{
        type: Date,
    },
    contacts:[this]

})

// UserSchema.statics.countContacts = async function (userId) {
//     const popularity = await this.aggregate([  // ver video 22 seccion 11
//         { 
//             $match : { user: userId } 
//         },
//         { 
//             $group:{
//                   _id: '$user', 
//                   nContacts: { $sum: 1 },
//             },
            
//         }
//     ])
//     if(popularity.length > 0){
//         await this.findByIdAndUpdate(userId,{
//             nContacts: popularity[0].nContacts
//         }) 
//     }  
// };

// UserSchema.post('save', async function(){
//     this.constructor.countContacts(this._id)
// });

// UserSchema.pre(/^findOneAnd/,async function(next){
//     this.temp = await User.findOne();
//     next()
// })

// UserSchema.post(/^findOne/,async function(){
//     await this.temp.constructor.countContacts(this.temp._id)
// })

userSchema.methods.verifyPassword = async function(candidate){
    return await bcrypt.compare(candidate, this.password)
};
userSchema.methods.hasSamePasswordSince = async function(timestamp){ 
    // timestamp must be multiplied by 1000 if used the default iat when constructing tokens
        if (this.passwordChangedAt){
            const lastChangeAt = this.passwordChangedAt.getTime()
            return (lastChangeAt <= timestamp*1000);
        };
        return true
};
userSchema.methods.createResetToken = function(){
        const _resetToken = crypto.randomBytes(64).toString('hex');
        this.resetToken = crypto.createHash('sha256').update(_resetToken).digest('hex');
        this.resetTokenExpiration = Date.now() + 10 * 60 * 1000;

        return _resetToken;
};

userSchema.statics.manageContacts = async function(id, emails,options){
    // const condition = emails.map(element => { 
    //     return { email : { $eq: element } } 
    // });
    let newContacts = await this.aggregate([
        {
            // $match: { $or : condition }
            $match: { email : { $in: emails } }
        },{
            $project: { _id: true }
        }
    ])
    newContacts = newContacts.map(contacts => contacts._id)
    if (options.action === 'add'){
        return await this.findByIdAndUpdate(
            id,
            { 
                $addToSet : { 
                    contacts: { 
                        $each: newContacts
                    } 
                } 
            },
            {
                new: true,
                runValidators: true
            })
    }
    else if (options.action === 'delete'){
       await this.findByIdAndUpdate(id,{
         $pull: { contacts: { $in : newContacts } }
        },{
          new: true,
          runValidators: true
        })
    }
   return 
}


userSchema.pre('save',async function (next) {
    if (!this.isModified('password') ) return next();

    this.passwordChangedAt = Date.now()-2000 ; // two seconds, in case of latency
    this.password = await bcrypt.hash(this.password,12);
    next()
})

userSchema.pre(/^find/,function(next){
    this.find({active: true});
    next()
})


const User = mongoose.model('User',userSchema);

module.exports.joiSchema = joiSchema;
module.exports.User = User;

