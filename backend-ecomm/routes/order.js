const express = require('express');
const { createOrder, getAllOrders, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/order')
  .post(createOrder)
  .get(getAllOrders);

router.delete('/order/:id', deleteOrder);

module.exports = router;
