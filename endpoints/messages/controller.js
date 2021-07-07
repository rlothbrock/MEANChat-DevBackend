const { Message } = require("./schema")

module.exports.getAllMessages = async function(req, res, next){
    const messages = await Message.find();
    return res.status(200).json({
        status:'success',
        data:{messages}
    })
}

module.exports.createMessage = async function(req, res, next){
    try {
        const { room, from, to, text } = req.body;
        const message = await Message.create({
            room, from, to, text
        });
        
        return res.status(200).json({
            status:'success',
            data:{message}
        })
    } catch (error) {
        return res.status(500).json({
            status:'error',
            data:{error}
        })
    }
}
