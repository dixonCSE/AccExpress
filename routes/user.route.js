require("dotenv").config();
const express = require("express");
const router = express.Router();
//const userController = require("../controllers/user.controller");

const { auth, roleCheck } = require("../middleware/auth.middleware");

router.use(auth);
router.use(roleCheck("user"));

//router.get("/user_data", userController.userData);

module.exports = router;
