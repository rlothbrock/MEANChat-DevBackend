const { Room } = require("./schema");

module.exports.createRoom = async function(req, res, next){
    try {
        let members = req.body.members;
        const room = await Room.create({members});
        
        return res.status(201).json({
            status:'success',
            data:{room}
        })   
    } catch (error) {
        res.status(500).json({
            status:'error',
            data:{error}
        })
    }
};

module.exports.getAllRooms = async function(req, res, next){
    const room = await Room.find()

    return res.status(200).json({
        status:'success',
        data:{ room }
    });
}

module.exports.getRoom = async function(req, res, next){
    const room = await Room.findById(req.params.id)

    return res.status(200).json({
        status:'success',
        data:{ room }
    });
}

// getAllMyRooms missing
