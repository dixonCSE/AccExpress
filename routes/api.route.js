require("dotenv").config();
const express = require("express");
const router = express.Router();

const { auth, roleCheck } = require("../middleware/auth.middleware");

const dbController = require("../controllers/db.controller");

//router.use(auth);
//router.use(roleCheck("admin"));

router.get("/gets", dbController.Gets);
router.get("/list", dbController.List);
router.get("/:id", dbController.Get);
// router.post("/api/insert", dbController.Insert);
// router.post("/api/update", dbController.Update);
// router.delete("/api/delete/:id", dbController.Delete);

module.exports = router;
