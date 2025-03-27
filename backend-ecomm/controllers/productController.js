const ProductModel = require('../models/productModel');
//Get products api - /api/v1/products
exports.getProducts=async (req, res, next) => {
    const query = req.query.keyword?{//search by name -products
        name:{
            $regex:req.query.keyword,
            $options:'i'
        }   
    }:{}
     const products = await ProductModel.find(query);

        res.json({
            success: true,
            //message: 'Get products working!'
            products
        })

    
}
//Get products api - /api/v1/product/:id
    exports.getSingleproduct= async(req, res, next) => {

        try {
            console.log(req.params.id,'ID');
            const product = await ProductModel.findById(req.params.id);

        res.json({
            success: true,
            product //message: 'Get single product working!'
          
        })
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "Unable to get product with that id " //+ error.message              
            })
        }
        
    }


    