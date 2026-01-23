const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const productController = require("./controller");
const { protect, adminOnly } = require("../auth/middleware");

/* Multer Config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* CREATE PRODUCT WITH IMAGE */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),        // 👈 NEW
  productController.createProduct
);

/* DASHBOARD */
router.get("/", protect, adminOnly, productController.getAllProducts);

/* SINGLE PRODUCT */
router.get("/:productId", protect, adminOnly, productController.getProduct);

/* UPDATE PRODUCT */
router.patch(
  "/:productId",
  protect,
  adminOnly,
  productController.updateProduct
);


/* REVOKE PRODUCT */
router.patch(
  "/:productId/revoke",
  protect,
  adminOnly,
  productController.revokeProduct
);


/* DELETE PRODUCT (ONLY DRAFT) */
router.delete(
  "/:productId",
  protect,
  adminOnly,
  productController.deleteProduct
);


module.exports = router;