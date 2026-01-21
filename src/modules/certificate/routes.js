// src/modules/certificate/certificate.routes.js
const express = require("express");
const router = express.Router();

const certificateController = require("./controller");
const { protect, adminOnly } = require("../auth/middleware");

/* Generate certificate */
router.post(
  "/generate/:productId",
  protect,
  adminOnly,
  certificateController.generateCertificate
);

module.exports = router;
