const express = require('express');
const { createOrder, getAllOrders, deleteOrder,downloadInvoice } = require('../controllers/orderController');
const router = express.Router();



router.route('/order')
  .post(createOrder)
  .get(getAllOrders);

router.delete('/order/:id', deleteOrder);


// ✅ Route for invoice PDF download
router.get('/order/report/:id', downloadInvoice);

module.exports = router;
