const sharp = require('sharp');
const path = require('path');
const multer = require('multer');
const AppError = require('./error.handling/appError')

const appStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/profile-images')
    },
    filename:(req, file, callback) =>{
        let extension = '';
        switch (file.mimetype) {
            case 'image/gif':
                extension = 'gif'
                break;
            case 'image/png':
                extension = 'png'
                break;
            case 'image/jpeg':
                extension = 'jpg'
                break; 
            default:
                break;
        }
        callback(null,`IMG_${Date.now()}_${req.user._id}.${extension}`);
    }
});




// image handling using sharp module... (dropped after using MEAN stack)
async function imageResizing(req, res, next){
    try {    
        if (!req.file) {
            return next()}
        await sharp(req.file[0].buffer)
        .resize(200,200)
        .toFormat('jpeg',{})
        .jpeg({quality: 90})
        .toFile(path.join(__dirname,'../../static/img',req.file[0].filename));
        next();
    } catch (error) {
        console.log('error on resizing image');
        console.log(error);
        return new AppError('oops....',500);
    }
}

module.exports.upload = multer({storage: appStorage });
module.exports.imageResize = imageResizing;
