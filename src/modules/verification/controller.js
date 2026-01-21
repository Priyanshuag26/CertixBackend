// src/modules/verification/verify.controller.js
const verifyService = require("./service");

exports.verifyProduct = async (req, res) => {
  const result = await verifyService.verifyProduct(req.params.productId);

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      status: "INVALID",
      reason: result.reason,
    });
  }

  res.json({
    success: true,
    status: "AUTHENTIC",
    data: result.data,
  });
};
