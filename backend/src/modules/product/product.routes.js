// product.routes.js
const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const { verifyToken, isProductManager } = require("../../middleware/isAdmin");
const upload = require("../../middleware/upload");
const { checkSubscription } = require("../../middleware/checkSubscription");


// multiple images upload
router.post(
  "/create",
  verifyToken,
  // checkSubscription, // only SUBSCRIBED users can add product
  isProductManager,
  upload.array("images", 5),
  productController.createProduct
);

// 🔹 Get All
router.get("/", productController.getAllProducts);

// get all products for admin (with pagination, filters, etc.)
router.get(
  "/user/:categoryId", verifyToken,
  productController.getProductsByCategory
);


// 🔹 Get Single
router.get("/:id", verifyToken, productController.getSingleProduct);


// 🔹 Update Product
router.put(
  "/:id",
  verifyToken,
  isProductManager,
  upload.array("images", 5),
  productController.updateProduct
);


// 🔹 Delete Product
router.delete(
  "/:id",
  verifyToken,
  isProductManager,
  productController.deleteProduct
);



module.exports = router;
