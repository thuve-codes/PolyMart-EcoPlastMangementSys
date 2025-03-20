
//Get products api - /api/v1/products
exports.getProducts=async (req, res, next) => {
        res.json({
            success: true,
            message: 'Get products working!'
        })
    }
//Get products api - /api/v1/products
    exports.getSingleproduct= async(req, res, next) => {
  res.json({
            success: true,
            message: 'Get single product working!'
        })
    }