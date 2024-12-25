import express from 'express'
const router = express.Router();
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAllProductsAdmin,
} from "../controller/productController.js";
import { isAuthenticated, authorizeRole } from "../middleware/auth.js"

router.route("/products").get(getAllProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRole("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetail);

///Check create product review and getproduct review
router.route("/review").put(isAuthenticated, createProductReview);

router
  .route("/admin/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

router
  .route("/admin/products")
  .get(isAuthenticated, authorizeRole("admin"), getAllProductsAdmin);

export default router;
