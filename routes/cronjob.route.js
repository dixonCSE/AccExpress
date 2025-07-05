require("dotenv").config();
const express = require("express");
const router = express.Router();

const cronjobController = require("../controllers/cronjob.controller");

router.get("/remind", cronjobController.RemindSms);
router.get("/renew", cronjobController.Renew);
router.get("/renew_bill", cronjobController.RenewBill);
router.get("/end_boost_sms", cronjobController.EndBoostSms);

module.exports = router;
