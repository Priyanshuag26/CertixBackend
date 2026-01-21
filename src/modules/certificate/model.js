const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      unique: true,
      required: true, // UUID
    },

    productId: {
      type: String,
      required: true, 
      ref: "Product",
    },

    verificationUrl: {
      type: String,
      required: true,
    },

    qrCodeUrl: {
      type: String, // stored image path or cloud URL

    },

    certificatePdfUrl: {
      type: String, // S3 / Azure Blob
      required: true,
    },

    dataHash: {
      type: String, // SHA-256 hash
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
