const express = require('express');
const router = express.Router();

const walletController = require("../controllers/walletController");
const isAuth = require("../../utility/authJwt");
const isAdmin = require("../../utility/authAdmin");

router.get("/walletDetails",isAuth,walletController.getWalletBalance);
router.post("/addCash",isAuth,walletController.addCash);
router.post("/withdrawCash",isAuth,walletController.withdrawCash);
router.get("/recentTransaction",isAuth,walletController.getRecentTransaction);
router.get("/withdrawAllCash",isAuth,walletController.withdrawAllCash);

module.exports = router;