const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    /* 🔑 PUBLIC ID (used in QR, certificates) */
    productId: {
      type: String,
      unique: true,
      required: true,
    },

    /* 🧪 PRODUCT / INSPECTION DATA */
    weightGrams: {
      type: Number,
      required: true,
    },

    shape: {
      type: String,
    },

    color: {
      type: String,
    },

    measurement: {
      type: String,
    },

    mounted: {
      type: Boolean,
      default: false,
    },

    faces: {
      type: String,
    },

    xRays: {
      type: String, // e.g. "Yes / No / NA" or report id
    },

    createdFace: {
      type: String,
    },

    test: {
      type: String, // test name or summary
    },

    comments: {
      type: String,
    },

    identification: {
      type: String,
    },  

    image: {
      type: String, // image URL (S3 / Cloudinary)
    },

    /* 📌 SYSTEM FIELDS */
    status: {
      type: String,
      enum: ["DRAFT", "CERTIFIED", "REVOKED"],
      default: "DRAFT",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);
