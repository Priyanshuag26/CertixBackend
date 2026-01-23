// src/modules/product/product.controller.js
const productService = require("./service");

exports.createProduct = async (req, res) => {
  console.log("----- CREATE PRODUCT REQUEST RECEIVED -----");

  try {
    // 1. Log incoming data
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // 2. Extract image path
    const imagePath = req.file ? `uploads/${req.file.filename}` : "";
    console.log("Image Path Resolved:", imagePath);

    // 3. Prepare payload
    const payload = {
      ...req.body,
      image: imagePath,
    };

    console.log("Final Payload To Service:", payload);
    console.log("Admin ID:", req.user?.id);

    // 4. Call service
    const product = await productService.createProduct(
      payload,
      req.user.id
    );

    console.log("Product Created Successfully:", product);

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (err) {
    console.error("❌ PRODUCT CREATE ERROR");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json({ success: true, data: products });
};

exports.getProduct = async (req, res) => {
  try {
    const product = await productService.getProductByProductId(
      req.params.productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });

  } catch (err) {
    console.log("GET PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.productId,
      req.body
    );

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.revokeProduct = async (req, res) => {
  try {
    const product = await productService.revokeProduct(
      req.params.productId
    );

    res.json({
      success: true,
      message: "Product revoked successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(
      req.params.productId
    );

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err.message);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

