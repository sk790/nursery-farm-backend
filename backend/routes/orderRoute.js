import express from 'express'
const router = express.Router();
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controller/orderController.js"
import { isAuthenticated, authorizeRole } from "../middleware/auth.js";
router.route("/order/new").post(isAuthenticated, newOrder);

router.route("/order/:id").get(isAuthenticated, getSingleOrder);

router.route("/myorder/me").get(isAuthenticated, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeRole("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateOrder)
  .delete(isAuthenticated, authorizeRole("admin"), deleteOrder);

export default router