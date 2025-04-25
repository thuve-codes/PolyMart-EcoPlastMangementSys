const express = require('express');
const { createOrder, getAllOrders, getOrderById } = require('../controllers/orderController');
const router = express.Router();

router.route('/order')
  .post(createOrder)
  .get(getAllOrders);



module.exports = router;
