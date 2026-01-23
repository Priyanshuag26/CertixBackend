// src/modules/verification/verify.service.js
const crypto = require("crypto");
const Product = require("../product/model");
const Certificate = require("../certificate/model");

exports.verifyProduct = async (productId) => {
  /* 1. Fetch product */
  const product = await Product.findOne({ productId });
  if (!product) {
    return {
      valid: false,
      reason: "PRODUCT_NOT_FOUND",
    };
  }

  /* 2. Fetch certificate */
  const certificate = await Certificate.findOne({ productId });
  if (!certificate) {
    return {
      valid: false,
      reason: "CERTIFICATE_NOT_FOUND",
    };
  }

  /* 3. Status checks */
  if (product.status === "REVOKED") {
    return {
      valid: false,
      reason: "PRODUCT_REVOKED",
    };
  }

  if (product.status !== "CERTIFIED") {
    return {
      valid: false,
      reason: "PRODUCT_NOT_CERTIFIED",
    };
  }

  /* 4. Recompute hash */
  const recomputedHash = crypto
  .createHash("sha256")
  .update(
    JSON.stringify({
      productId: product.productId,
      weightGrams: product.weightGrams,
      faces: product.faces,                     // ✅ ADD THIS
      certificateId: certificate.certificateId,
    })
  )
  .digest("hex");


  /* 5. Hash comparison */
  if (recomputedHash !== certificate.dataHash) {
    return {
      valid: false,
      reason: "DATA_TAMPERED",
    };
  }

  /* 6. AUTHENTIC */
 return {
  valid: true,
  data: {
    /* Product */
    productId: product.productId,
    weightGrams: product.weightGrams,
    shape: product.shape,
    color: product.color,
    measurement: product.measurement,
    mounted: product.mounted,
    faces: product.faces,
    xRays: product.xRays,
    createdFace: product.createdFace,
    test: product.test,
    comments: product.comments,
    identification: product.identification,
    image: product.image,

    /* Certificate */
    certificateId: certificate.certificateId,
    issuedAt: certificate.issuedAt,
    verificationUrl: certificate.verificationUrl,
    certificatePdfUrl: certificate.certificatePdfUrl,

    /* System */
    status: product.status,
  },
};

};
