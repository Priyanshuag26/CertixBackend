// src/modules/verification/verify.routes.js
const express = require("express");
const router = express.Router();

const verifyController = require("./controller");

/* Public verification endpoint */
router.get("/:productId", verifyController.verifyProduct);

module.exports = router;
