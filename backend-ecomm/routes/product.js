const express=require('express');
const { getProducts, getSingleproduct } = require('../controllers/productController');
const router = express.Router();

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleproduct);

module.exports = router;

//const { getProducts } = require('../controllers/productControllers');

//const { getSingleproduct } = require('../controllers/productControllers');

//export default router;