const sharp = require('sharp');
const path = require('path');
const multer = require('multer');
const AppError = require('./../utils/error.handling/appError')

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
            console.log('retornando en !req.file')
            return next()};
        await sharp(req.file[0].buffer)
        .resize(200,200)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(path.join(__dirname,'../../static/img',req.file[0].filename));
        next();
    } catch (error) {
        console.log('error on resizing image');
        console.log(error);
        return new AppError('oops....',500);
    }
};

module.exports.upload = multer({storage: appStorage });
module.exports.imageResize = imageResizing;





// async function multipleImagesResizing(req, res, next){
//     if (!req.files) return next();
//     //1) single image field
//         const resourceImageName = `resourceName-${req.params.id}-${Date.now()}-imagePurpose.jpeg`;
//         await sharp(req.files.fieldName[0].buffer)
//         .resize(2000,1333)
//         .toFormat('jpeg')
//         .jpeg({quality: 90})
//         .toFile(path.join(__dirname,'../../static/img',resourceImageName));
//         req.body.fieldName = resourceImageName;
        
//     //2) multiple image field
//         req.body.fieldmultiName = [];
//         const pendingImages = req.files.fieldmultiName.map(async (file,index) =>{
//             const resourceImageName = `resourceName-${req.params.id}-${Date.now()}-imagePurpose${index+1}.jpeg`;
//             await sharp(file.buffer)
//             .resize(2000,1333)
//             .toFormat('jpeg')
//             .jpeg({quality: 90})
//             .toFile(path.join(__dirname,'../../static/img',resourceImageName));       
//             req.fieldmultiName.push(resourceImageName);
//         });
//         await Promise.all(pendingImages);
//         next()
// };



