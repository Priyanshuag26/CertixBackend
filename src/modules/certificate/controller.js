// src/modules/certificate/certificate.controller.js
const certificateService = require("./service");

exports.generateCertificate = async (req, res) => {
  try {
    const certificate = await certificateService.generateCertificate(
      req.params.productId,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      data: certificate,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
