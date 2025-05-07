const mongoose=require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    plastType: String,
    description: String,
    ratings: String,
    images:[
        {
            image: String
        }
    ],
    category: String,
    seller: String,
    stock: String,
    numOfReviews: String,
    /*reviews:[
        {
            name: String,
            rating: String,
            comment: String
        }
    ]  ,*/
    createdAt: Date
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;

