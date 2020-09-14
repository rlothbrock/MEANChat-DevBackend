// // this code is for reminding query features 

// exports = class APIFeatures {
// 	constructor(queryDocs, queryString){
// 	 	this.queryDocs = queryDocs; 
//         this.queryString = queryString;
//     };

//     filter(){
//         const queryObj = {... this.queryString};
//         const excludedFields = ['page', 'limit', 'sort', 'fields'];    
// 		excludedFields.forEach(
//             (field) => { delete queryObj[field] }
//         )

//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace( /\b(lte|gte|gt|lt)\b/g,(match)=>{return `$${match}`})  
        
//         this.queryDocs = this.queryDocs.find(JSON.parse(queryStr));
//         return this;
//     }

//     sorting(){
//         if (this.queryString.sort){
//             const sortParams = this.queryString.sort.split(',').join(' ');
//             this.queryDocs = this.queryDocs.sort(sortParams);
//         }else{ 
//             this.queryDocs = this.queryDocs.sort('_id');
//         }  
//         return this;
//     }

//     limiting(){
//         if (this.queryString.fields){
//             const fieldParams = this.queryString.fields.split(',').join(' ');
//             this.queryDocs = this.queryDocs.select(fieldParams);
//         }else{ 
//             this.queryDocs = this.queryDocs.select('-__v')
//         } 
//         return this;
//     }

//     page(model){
//         // model is the Mongoose Model that created the collection the current query is based on.
//         const page =  this.queryString.page  * 1 || 1 ;
// 		const limitVal = this.queryString.limit * 1 || 10 ;
// 		const skipVal = ( page - 1 ) * limitVal;

// 		this.queryDocs = this.queryDocs.skip(skipVal).limit(limitVal);

// 		if (this.queryString.page){
// 			const numDocs = await model.countDocuments();
// 		 	if (skipVal >= numDocs){ throw new Error('requested resource not found') }
// 		}

//         return this;
//     }
// }
   