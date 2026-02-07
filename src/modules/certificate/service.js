// src/modules/certificate/certificate.service.js
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const Product = require("../product/model");
const Certificate = require("./model");

const {
  generateQRCode,
  generateCertificateImage,
} = require("./generator");

const { getNextSequence } = require("./getNextSequence");

function formatCertNumber(seq, region = "UK") {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const padded = String(seq).padStart(6, "0");

  return `${year}${month}${region}${padded}`;
}


exports.generateCertificate = async (productId, adminId) => {
  const product = await Product.findOne({ productId });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.status !== "DRAFT") {
    throw new Error("Certificate already generated or product revoked");
  }

  const seq = await getNextSequence("certificate");

  const certificateId = formatCertNumber(seq, "UK");


  const verificationUrl =
    `${process.env.BASE_URL}/verify/${product.productId}`;

  /* 1. Generate QR FILE */
  const qrPath = await generateQRCode(
    verificationUrl,
    certificateId
  );
  // returns → "/uploads/qr-123.png"

  /* 2. Hash */
  const dataHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        productId: product.productId,
        weightGrams: product.weightGrams,
        faces: product.faces,
        certificateId,
      })
    )
    .digest("hex");

  /* 3. Generate CERTIFICATE IMAGE */
  const certificateImagePath =
    await generateCertificateImage({
      product,
      certificateId,
      qrPath,          // pass path
    });
  // returns → "/uploads/cert-123.png"

  /* 4. Save certificate with PUBLIC URLs */
  const certificate = await Certificate.create({
    certificateId,
    productId: product.productId,

    verificationUrl,

    qrCodeUrl: qrPath,                 // ✅ SAVE QR URL
    certificatePdfUrl: certificateImagePath, // PNG path

    dataHash,
    issuedBy: adminId,
  });

  /* 5. LINK TO PRODUCT (IMPORTANT) */
  product.status = "CERTIFIED";
  product.certificateId = certificate._id;   // 🔥 MUST
  await product.save();

  return certificate;
};
