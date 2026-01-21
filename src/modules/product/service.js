// src/modules/product/product.service.js
const { v4: uuidv4 } = require("uuid");
const Product = require("./model");
const Certificate = require("../certificate/model");

/* CREATE PRODUCT (DRAFT ONLY) */
exports.createProduct = async (data, adminId) => {
  const product = await Product.create({
    productId: uuidv4(), // public ID
    ...data,
    createdBy: adminId,
  });

  return product;
};

/* GET ALL PRODUCTS (Dashboard) */
exports.getAllProducts = async () => {
  return Product.find().sort({ createdAt: -1 });
};

/* GET SINGLE PRODUCT WITH CERTIFICATE */
exports.getProductByProductId = async (productId) => {
  const product = await Product.findOne({ productId });

  if (!product) return null;

  const certificate = await Certificate.findOne({ productId });

  return {
    ...product.toObject(),
    certificate,   // attach manually
  };
};


/* UPDATE PRODUCT (ONLY IF DRAFT) */
exports.updateProduct = async (productId, data) => {
  const product = await Product.findOne({ productId });
  if (!product) throw new Error("Product not found");

  if (product.status !== "DRAFT") {
    throw new Error("Certified or revoked products cannot be edited");
  }

  Object.assign(product, data);
  await product.save();

  return product;
};

/* REVOKE PRODUCT */
exports.revokeProduct = async (productId) => {
  const product = await Product.findOne({ productId });
  if (!product) throw new Error("Product not found");

  if (product.status !== "CERTIFIED") {
    throw new Error("Only certified products can be revoked");
  }

  product.status = "REVOKED";
  await product.save();

  return product;
};
