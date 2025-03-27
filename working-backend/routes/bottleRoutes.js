const express = require("express");
const { createBottleRequest, getBottleRequests, deleteBottleRequest } = require("../controllers/bottleController");

const router = express.Router();

router.post("/bottles", createBottleRequest);
router.get("/bottles", getBottleRequests);
router.delete("/bottles/:id", deleteBottleRequest);

module.exports = router;
