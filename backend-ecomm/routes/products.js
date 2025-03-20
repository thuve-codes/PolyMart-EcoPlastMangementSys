const express=require('express');
const router = express.Router();

router.route('/products').get((req, res) => {
    res.send('Hello from products route');
}