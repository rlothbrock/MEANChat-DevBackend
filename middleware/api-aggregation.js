// const {User} = require('../users/schema');
// // not yet implemented...

// async (req, res)=>{
//     const pipe  = User.aggregate([
//         {
//             $match: { ratingsAv: { $gte: 4.5 } }
//         },{
//             $group:{
//                 _id: { $toUpper: '$difficulty' },    
//                 avRating: { $avg: '$ratingsAv' },
//                 avPrice: { $avg: '$price' },
//                 minPrice: { $min: '$price' },
//                 maxPrice: { $max: '$price' },

//             }
//         }
//     ])
// }


