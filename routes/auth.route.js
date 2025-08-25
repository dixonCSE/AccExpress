require("dotenv").config();
const express = require("express");
const CryptoJS = require("crypto-js");
const { check, body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth.middleware");

const authService = require("../services/auth.service");
const db = require("../services/db.service");

const router = express.Router();

// login
router.post(
	"/login",
	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////
	body("login_id").trim(),
	body("password").trim(),
	check("login_id").notEmpty().withMessage("Login ID required"),
	check("password").notEmpty().withMessage("Password ID required"),
	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////

	async (req, res) => {
		///////////////////////////////////////////// begin validation /////////////////////////////////////////////
		// console.log("myVar ddccd");
		// setting.set("myVar", "Hello, World!");
		// console.log(setting.get("myVar"));
		// console.log(setting.get("theme"));
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// return res
			// 	.status(200)
			// 	.json({ error: true, message: errors.array() });

			return res.status(200).json({
				error: true,
				type: "error",
				msg: "Login Falied, validation error",
				devMsg: errors.array(),
			});
		}
		////////////////////////////////////////////// end validation //////////////////////////////////////////////

		try {
			//console.log(req.body);
			let user = await authService.login(req.body.login_id, req.body.password);

			if (user.error) {
				res.status(200).json({
					error: true,
					type: "error",
					msg: "Login Falied, User ID or Password Error",
					devMsg: [{ msg: user.msg }],
				});
			} else {
				res.status(200).json({
					error: false,
					type: "success",
					msg: "Login Successful",
					devMsg: [{ msg: "Login Successful" }],

					data: {
						accessToken: user.accessToken,
						refreshToken: user.refreshToken,
						redirectUrl: user.redirect,
					},
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				type: "error",
				mag: "Login Falied, User ID or Password Error catch",
				devMsg: [{ msg: err }],
			});
		}
	},
);

// signup
router.post(
	"/signup",

	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////
	body("user_name").trim(),
	body("email").trim().normalizeEmail(),
	body("password").trim(),
	check("user_name").notEmpty().withMessage("User name required"),
	check("email").notEmpty().withMessage("Email required"),
	check("email").isEmail().withMessage("Email formate is not valid"),
	check("password").notEmpty().withMessage("Password required"),
	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////
	async (req, res) => {
		let tmpRes;
		let user;

		const errors = validationResult(req);
		let validationErr = Array.from(errors.array(), (x) => {
			return { value: x.value, msg: x.msg, param: x.param };
		});

		///////////////////////////////////////////// begin validation /////////////////////////////////////////////

		/* if (!errors.isEmpty()) {
			return res.status(200).json({
				error: true,
				message: "SignUp Falied",
				validationErr:validationErr,
				devMsg: errors.array(),
			});
		} */

		tmpRes = await db.rowCount({
			table: "user",
			filter: { login_id: req.body.user_name },
		});

		if (tmpRes > 0) {
			validationErr.push({
				value: req.body.user_name,
				msg: "User ID already exist",
				param: "user_name",
			});
			/* return res.status(200).json({
				error: true,
				message: "User ID already exist",
				validationErr:validationErr,
				devMsg: [{ msg: "Login ID already exist" }],
			}); */
		}

		if (validationErr.length > 0) {
			return res.status(200).json({
				error: true,
				message: "SignUp Falied, validation error",
				validationErr: validationErr,
				devMsg: validationErr,
			});
		}
		////////////////////////////////////////////// end validation //////////////////////////////////////////////

		user = {
			login_id: req.body.user_name,
			user_name: req.body.user_name,
			email: req.body.email,
			password: req.body.password,
		};

		try {
			const result = await authService.signup(user);
			/* res.status(200).json({
				error: result.error,
				message: result.message,
			}); */
			if (result.error) {
				res.status(200).json({
					error: false,
					message: "SignUp failed",
					devMsg: [{ msg: result.message }],
				});
			} else {
				res.status(200).json({
					error: false,
					message: "SignUp Successful",
					devMsg: [{ msg: result.message }],
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				message: "SignUp Falied",
				devMsg: [{ msg: err }],
			});
		}
	},
);

// recover_password
router.post(
	"/recover_password",

	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////
	body("login_id").trim(),
	body("email").trim().normalizeEmail(),
	check("login_id").notEmpty().withMessage("User name required"),
	check("email").notEmpty().withMessage("Email required"),
	check("email").isEmail().withMessage("Email formate is not valid"),
	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////
	async (req, res) => {
		let tmpRes;
		let user;

		const errors = validationResult(req);
		let validationErr = Array.from(errors.array(), (x) => {
			return { value: x.value, msg: x.msg, param: x.param };
		});

		///////////////////////////////////////////// begin validation /////////////////////////////////////////////

		tmpRes = await db.rowCount({
			table: "user",
			filter: {
				login_id: req.body.login_id,
				email: req.body.email,
				is_active: 1,
				is_delete: 0,
			},
		});

		if (tmpRes == 0) {
			validationErr.push({
				value: req.body.login_id,
				msg: "Login ID Not exist",
				param: "login_id",
			});
		}

		if (validationErr.length > 0) {
			return res.status(200).json({
				error: true,
				message: "Recover password Falied, validation error",
				validationErr: validationErr,
				devMsg: validationErr,
			});
		}

		////////////////////////////////////////////// end validation //////////////////////////////////////////////

		user = await db.getRow({
			table: "user",
			filter: {
				login_id: req.body.login_id,
				email: req.body.email,
				is_active: 1,
				is_delete: 0,
			},
		});

		try {
			const result = await authService.recoverPasswordEmailLink(user);
			if (result.error) {
				res.status(200).json({
					error: false,
					message: "Recover password failed",
					devMsg: [{ msg: result.message }],
				});
			} else {
				res.status(200).json({
					error: false,
					message: "recover password Successful, check your email",
					devMsg: [{ msg: result.message }],
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				message: "Recover password falied",
				devMsg: [{ msg: err }],
			});
		}
	},
);

// reset_password
router.post(
	"/reset_password",

	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////
	body("new_password").trim(),
	check("new_password").notEmpty().withMessage("New password required"),
	body("confirm_new_password").trim(),
	check("confirm_new_password")
		.notEmpty()
		.withMessage("Confirm new password required"),
	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////
	async (req, res) => {
		let tmpRes;

		const errors = validationResult(req);
		let validationErr = Array.from(errors.array(), (x) => {
			return { value: x.value, msg: x.msg, param: x.param };
		});

		///////////////////////////////////////////// begin validation /////////////////////////////////////////////

		const token = CryptoJS.AES.decrypt(
			req.body.token,
			process.env.SECURITY_PRIVATE_KEY,
		).toString(CryptoJS.enc.Utf8);

		const tokenJSON = JSON.parse(token);
		const userId = tokenJSON.userId;

		tmpRes = await db.rowCount({
			table: "user",
			filter: {
				id: userId,
				is_active: 1,
				is_delete: 0,
			},
		});

		if (tmpRes == 0) {
			validationErr.push({
				value: req.body.token,
				msg: "User Not exist",
				param: "token",
			});
		}

		if (validationErr.length > 0) {
			return res.status(200).json({
				error: true,
				message: "Reset password Falied, validation error",
				validationErr: validationErr,
				devMsg: validationErr,
			});
		}

		////////////////////////////////////////////// end validation //////////////////////////////////////////////

		const new_password = req.body.new_password;

		try {
			const result = await authService.changePassword(userId, new_password);
			if (result.error) {
				res.status(200).json({
					error: false,
					message: "Reset password failed",
					devMsg: [{ msg: result.message }],
				});
			} else {
				res.status(200).json({
					error: false,
					message: "Reset password Successful",
					devMsg: [{ msg: result.message }],
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				message: "Reset password falied",
				devMsg: [{ msg: err }],
			});
		}
	},
);

// test
router.get(
	"/test",
	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////

	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////

	async (req, res) => {
		///////////////////////////////////////////// begin validation /////////////////////////////////////////////

		////////////////////////////////////////////// end validation //////////////////////////////////////////////

		try {
			let result = await db.query("SELECT * FROM `user` WHERE `id` = ?", [
				100001,
			]);
			console.log(result);
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(200).json({
					error: true,
					message: "error 1",
					devMsg: [{ msg: "authService return false" }],
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				message: "error 2",
				devMsg: [{ msg: err }],
			});
		}
	},
);

// ud
router.get(
	"/ud",
	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////

	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////

	async (req, res) => {
		///////////////////////////////////////////// begin validation /////////////////////////////////////////////

		////////////////////////////////////////////// end validation //////////////////////////////////////////////

		const password = CryptoJS.AES.encrypt(
			"123456",
			process.env.SECURITY_PRIVATE_KEY,
		).toString();

		let sqlArray = [];

		sqlArray.push(
			"UPDATE `user` SET `email` = 'admin.emaikl' WHERE `id` = 11;",
		);
		sqlArray.push(
			"UPDATE `user` SET `email` = 'user.email' WHERE `id` = 100001;",
		);

		try {
			const pres = await db.trx(sqlArray);
			if (pres) {
				res.status(200).json({
					error: false,
					type: "success",
					msg: "success",
				});
			} else {
				res.status(200).json({
					error: true,
					type: "error",
					msg: "error",
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "db transaction try error",
			});
		}
	},
);

router.get(
	"/state",
	///////////////////////////////////////////////// begin middleware /////////////////////////////////////////////////
	auth,
	////////////////////////////////////////////////// end middleware //////////////////////////////////////////////////

	async (req, res) => {
		// if (req.user == undefined) {
		// 	res.status(200).json({
		// 		error: true,
		// 		type: "error",
		// 		logout: true,
		// 		msg: "Access Denied: No authorization token provided",
		// 	});
		// }

		try {
			const rows = await db.query(
				`
				SELECT 
					id, 
					user_name, 
					last_name, 
					first_name, 
					email, 
					company, 
					phone, 
					image, 
					image_thumb 
				FROM 
					user 
				WHERE
					id = ?
				LIMIT 0, 1
			`,
				[req.user.id],
			);

			if (rows.length > 0) {
				res.status(200).json({
					error: false,
					type: "success",
					msg: "success",
					data: rows[0],
				});
			} else {
				res.status(200).json({
					error: true,
					type: "error",
					msg: "error",
				});
			}
		} catch (err) {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "db Query try error",
			});
		}
	},
);

module.exports = router;
