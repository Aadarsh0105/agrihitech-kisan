// brand.routes.js
const express = require("express");
const router = express.Router();

const brandController = require("./brand.controller");
const { verifyToken, isBrandManager, isCompany } = require("../../middleware/isAdmin");
const upload = require("../../middleware/upload");

// 🔥 Only B2B users can create brand
router.post(
  "/create",
  verifyToken,
  isBrandManager,
  upload.single("image"),
  brandController.createBrand
);

// 🔹 Get All Brands
router.get("/", brandController.getAllBrands);
router.get("/my-brands", verifyToken, brandController.getMyBrands);
router.get(
  "/my-dealers",
  verifyToken,
  isCompany,
  brandController.getMyBrandDealers
);
router.get("/:id", brandController.getBrandsByCategory);

// User-specific brands
router.get(
  "/user/:categoryId",
  brandController.getUserBrandsByCategory
);

// Get brands by product ID
router.get(
  "/product/:productId/brands",
  verifyToken,
  brandController.getBrandsByProductId
);


// 🔹 Update Brand
router.put(
  "/:id",
  verifyToken,
  isBrandManager,
  upload.single("image"),
  brandController.updateBrand
);


// 🔹 Delete Brand
router.delete(
  "/:id",
  verifyToken,
  isBrandManager,
  brandController.deleteBrand
);

router.get("/:id/products", verifyToken, brandController.getProductsByBrand);

router.get(
  "/:id/my-products",
  verifyToken,
  brandController.getMyProductsByBrand
);



module.exports = router;
