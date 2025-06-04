require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//const { check, body, validationResult } = require("express-validator");

const { auth, roleCheck } = require("../middleware/auth.middleware");

const adminController = require("../controllers/admin.controller");
const balanceController = require("../controllers/balance.controller");
const serviceController = require("../controllers/service.controller");
const userController = require("../controllers/user.controller");
const bankController = require("../controllers/bank.controller");
const profileController = require("../controllers/profile.controller");
const paymentController = require("../controllers/payment.controller");
const expenseController = require("../controllers/expense.controller");
const userRoleController = require("../controllers/userRole.controller");
const salaryController = require("../controllers/salary.controller");
const employeeController = require("../controllers/employee.controller");
const addbalanceController = require("../controllers/addbalance.controller");
const withdrawController = require("../controllers/withdraw.controller");
const billController = require("../controllers/bill.controller");
const billPayController = require("../controllers/billpay.controller");
const billGetController = require("../controllers/billget.controller");
const billTypeController = require("../controllers/billType.controller");
const exchangeController = require("../controllers/exchange.controller");
const paymentSendController = require("../controllers/paymentSend.controller");

// const storage = multer.diskStorage({
// 	destination: "./public/uploads/",
// 	filename: (req, file, cb) => {
// 		cb(
// 			null,
// 			file.fieldname + "-" + Date.now() + path.extname(file.originalname),
// 		);
// 	},
// });

const upload = (loc = "./public/uploads/") => {
	return multer({
		storage: multer.diskStorage({
			destination: loc,
			filename: (req, file, cb) => {
				// cb(
				// 	null,
				// 	file.fieldname + "-" + Date.now() + path.extname(file.originalname),
				// );
				cb(
					null,
					"uploads" + "-" + Date.now() + path.extname(file.originalname),
				);
			},
		}),
		limits: { fileSize: 5 * 1024 * 1024 },
		fileFilter: (req, file, cb) => {
			const fileTypes = /jpeg|jpg|png|webp|gif/;
			const extName = fileTypes.test(
				path.extname(file.originalname).toLowerCase(),
			);
			const mimeType = fileTypes.test(file.mimetype);

			if (extName && mimeType) {
				return cb(null, true);
			} else {
				cb(new Error("Only images are allowed!"));
			}
		},
	});
};

router.use(auth);
router.use(roleCheck("admin"));

router.get("/user-role/list", userRoleController.List);
router.get("/user-role/:id", userRoleController.Get);

router.get("/user_data", adminController.userData);
router.post("/password/update", profileController.passwordUpdate);
router.get("/profile", profileController.get);
router.post("/balance", balanceController.balance);
router.get("/dashboard", adminController.dashboard);

router.get("/user/list", userController.userList);
router.get("/user/detail/:id", userController.userDetail);
router.get("/user/:id", userController.userGet);
router.post(
	"/user/insert",
	upload("./public/media/user/").single("imgx"),
	userController.userInsert,
);
router.post(
	"/user/update",
	upload("./public/media/user/").single("imgx"),
	userController.userUpdate,
);
router.delete("/user/delete/:id", userController.userDelete);

router.get("/service-type/list", serviceController.serviceTypeList);
router.get("/service/list", serviceController.serviceList);
router.get("/boost-service/list", serviceController.boostServiceGets);
router.get("/duration-service/list", serviceController.durServiceGets);
router.get("/gen-service/list", serviceController.genServiceGets);
router.get("/service/:id", serviceController.serviceGet);
router.post(
	"/service/insert",
	upload("./public/media/service/").single("imgx"),
	serviceController.serviceInsert,
);
router.post(
	"/service/update",
	upload("./public/media/service/").single("imgx"),
	serviceController.serviceUpdate,
);
router.delete("/service/delete/:id", serviceController.serviceDelete);

router.get("/user-service/list", serviceController.userServiceList);
router.get("/user-service/user/:id", serviceController.userServiceByUser);
router.post("/user-service/insert", serviceController.userServiceInsert);
router.get("/user-service/:id", serviceController.userServiceGet);
router.post(
	"/user-boost-service/insert",
	serviceController.userBoostServiceInsert,
);
router.post("/user-service/update", serviceController.userServiceUpdate);
router.delete("/user-service/delete/:id", serviceController.userServiceDelete);

router.post(
	"/user-duration-service/insert",
	serviceController.userDurationServiceInsert,
);
router.get(
	"/user-service/close/:id/:issms",
	serviceController.userServiceClose,
);

router.get("/bank/gets", bankController.bankGets);
router.get("/bank/list", bankController.bankList);
router.get("/bank/:id", bankController.bankGet);
router.post(
	"/bank/insert",
	upload("./public/media/bank/").single("imgx"),
	bankController.bankInsert,
);
router.post(
	"/bank/update",
	upload("./public/media/bank/").single("imgx"),
	bankController.bankUpdate,
);
router.delete("/bank/delete/:id", bankController.bankDelete);

router.get("/payment-receive/list", paymentController.receiveList);
router.get("/payment-receive/:id", paymentController.receiveGet);
router.get("/payment-receive/user/:id", paymentController.receiveGetByUser);
router.post("/payment-receive/insert", paymentController.receiveInsert);
router.post("/payment-receive/update", paymentController.receiveUpdate);
router.delete("/payment-receive/delete/:id", paymentController.receiveDelete);

router.get("/expense/list", expenseController.List);
router.get("/expense/:id", expenseController.Get);
router.post("/expense/insert", expenseController.Insert);
router.post("/expense/update", expenseController.Update);
router.delete("/expense/delete/:id", expenseController.Delete);

router.get("/salary/list", salaryController.List);
router.get("/salary/:id", salaryController.Get);
router.post("/salary/insert", salaryController.Insert);
router.post("/salary/update", salaryController.Update);
router.delete("/salary/delete/:id", salaryController.Delete);

router.get("/employee/gets", employeeController.Gets);
router.get("/employee/list", employeeController.List);
router.get("/employee/:id", employeeController.Get);
router.post(
	"/employee/insert",
	upload("./public/media/user/").single("imgx"),
	employeeController.Insert,
);
router.post(
	"/employee/update",
	upload("./public/media/user/").single("imgx"),
	employeeController.Update,
);
router.delete("/employee/delete/:id", employeeController.Delete);

router.get("/add-balance/list", addbalanceController.List);
router.get("/add-balance/:id", addbalanceController.Get);
router.post("/add-balance/insert", addbalanceController.Insert);
router.post("/add-balance/update", addbalanceController.Update);
router.delete("/add-balance/delete/:id", addbalanceController.Delete);
router.delete("/add-balance/delete/:id", employeeController.Delete);

router.get("/withdraw/list", withdrawController.List);
router.get("/withdraw/:id", withdrawController.Get);
router.post("/withdraw/insert", withdrawController.Insert);
router.post("/withdraw/update", withdrawController.Update);
router.delete("/withdraw/delete/:id", withdrawController.Delete);

router.get("/bill-type/list", billTypeController.List);
router.get("/bill-type/gets", billTypeController.Gets);
router.get("/bill-type/:id", billTypeController.Get);
router.post("/bill-type/insert", billTypeController.Insert);
router.post("/bill-type/update", billTypeController.Update);
router.delete("/bill-type/delete/:id", billTypeController.Delete);

router.get("/bill/list", billController.List);
router.get("/bill/gets", billController.Gets);
router.get("/bill/:id", billController.Get);
router.post("/bill/insert", billController.Insert);
router.post("/bill/update", billController.Update);
router.delete("/bill/delete/:id", billController.Delete);

router.get("/bill-get/list", billGetController.List);
router.get("/bill-get/gets", billGetController.Gets);
router.get("/bill-get/:id", billGetController.Get);
router.post("/bill-get/insert", billGetController.Insert);
router.post("/bill-get/insert_t1", billGetController.InsertT1);
router.post("/bill-get/insert_t2", billGetController.InsertT2);
router.post("/bill-get/update", billGetController.Update);
router.post("/bill-get/update_t2", billGetController.UpdateT2);
router.post("/bill-get/update_t1", billGetController.UpdateT1);
router.delete("/bill-get/delete/:id", billGetController.Delete);
router.get("/bill-get/close/:id", billGetController.Close);

router.get("/payment-send/list", paymentSendController.List);
router.get("/payment-send/:id", paymentSendController.Get);
router.post("/payment-send/insert", paymentSendController.Insert);
router.post("/payment-send/update", paymentSendController.Update);
router.delete("/payment-send/delete/:id", paymentSendController.Delete);

router.get("/bill-pay/list", billPayController.List);
router.get("/bill-pay/:id", billPayController.Get);
router.post("/bill-pay/insert", billPayController.Insert);
router.post("/bill-pay/update", billPayController.Update);
router.delete("/bill-pay/delete/:id", billPayController.Delete);

router.get("/exchange/list", exchangeController.List);
router.get("/exchange/:id", exchangeController.Get);
router.post("/exchange/insert", exchangeController.Insert);
router.post("/exchange/update", exchangeController.Update);
router.delete("/exchange/delete/:id", exchangeController.Delete);

module.exports = router;
