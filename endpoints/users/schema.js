// const childSchema = new Schema({ parentId: mongoose.ObjectId });
// The Mongoose ObjectId SchemaType.
// Used for declaring paths in your schema that should be MongoDB ObjectIds.
// Do not use this to create a new ObjectId instance, use mongoose.Types.ObjectId instead.
 
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        minlength: [5,'username too short, please use a 3 to 20 characters username'],
        maxlength: [50,'username too long, please use a 3 to 20 characters username'],
    },
    email:{
        type: String,
        required: [true,'an email is required'],
        unique: ['this email has already been used before. Use only unique emails'],
        validate:{
            validator:(input)=>{
                return /^.{3,25}@\w{3,10}.[a-z]{2,6}(.[a-z]{2,3})?$/.test(input)
            },
            message:'invalid email, please check your input'
        }
    },
    password:{
        type:String,
        select:false,//   use this prop for avoiding password to show
        required: [true,'a password is required'],
        minlength:[12,'password too short, please use a 12 to 100 characters password'],
        maxlength:[100,'password too long, please use a 12 to 100 characters password'],
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

userSchema.methods.verifyPassword = async function(candidate){
    return await bcrypt.compare(candidate, this.password)
    // this method will fail if used as it is, since this.password is not available
    // in schema,as it is flagged with select:false
    // but the only place where this method is used, projects the query
    // to include the password, so is still available and can be used
    // I have commented this line just for explanation purposes
    // The right way includes redefining the method to
    // perform an extra query inside the method body including the password
    // but so far that only adds extra querying to database and non extra benefits.
};
userSchema.methods.hasSamePasswordSince = async function(timestamp){
    // timestamp must be multiplied by 1000 if used the default iat when constructing tokens
        if (this["passwordChangedAt"]){
            const lastChangeAt = this["passwordChangedAt"].getTime()
            return (lastChangeAt <= timestamp*1000);
        }
        return true
};
userSchema.methods.createResetToken = function(){
        const _resetToken = crypto.randomBytes(64).toString('hex');
        this.resetToken = crypto.createHash('sha256').update(_resetToken).digest('hex');
        this.resetTokenExpiration = Date.now() + 10 * 60 * 1000;

        return _resetToken;
};

userSchema.statics.manageContacts = async function(id, emails,options){
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

module.exports.User = User;

