import express from "express";
const router = express.Router();

const { isAuthenticated } = require("../middleware/auth");
const {
  proccesPayment,
  sendStripeApiKey,
} = require("../controller/pyamentController");

router.route("/payment/process").post(isAuthenticated, proccesPayment);

// router.route("/stripeapikey").get(sendStripeApiKey); yha se stripe key send krne ki neeed nhi he mene frontend me he dedined kr di app.js me

module.exports = router;
