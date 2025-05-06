const express = require("express");

const { createProduct, getTotalProducts} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/count", getTotalProducts);

module.exports = router;
