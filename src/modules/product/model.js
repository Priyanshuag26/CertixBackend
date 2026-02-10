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

    // ✅ changed to string (unit included)
    weight: {
      type: String,
      required: true,
    },

    shape: String,
    color: String,
    measurement: String,
    mounted: String,
    faces: String,
    xRays: String,
    test: String,
    comments: String,
    identification: String,
    image: String,

    /* 🧬 NEW LAB TEST FIELDS */

    microscopicObservation: String,
    refractiveIndex: String,
    specificGravity: String,
    hardness: String,
    species: String,

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

/* INDEX */
productSchema.index({ productId: 1 });

/* ✅ SAFE EXPORT (prevents overwrite error with nodemon) */
module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);
