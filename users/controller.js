const { User } = require("./schema")

module.exports.getAllUsers = async function(req, res, next){
    const users = await User.find();

    return res.status(200).json({
        status:'success',
        data:{users}
    });
}