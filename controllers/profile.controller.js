require("dotenv").config();
// const fs = require("fs");
// const path = require("path");
const CryptoJS = require("crypto-js");

const db = require("../services/db.service.js");
const auth = require("../services/auth.service.js");
const _setting = require("../services/setting.service.js");
//const helper = require("../utils/dbHelper.util.js");
// const dateTime = require("../utils/cdate.util.js");

const passwordUpdate = async (req, res, next) => {
	// const cdate = dateTime.cDateTime();

	setting = await _setting.get();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.currentPassword == undefined ||
			req.body.currentPassword == ""
		) {
			validation = false;
			validationMsg = "Current Password required";
			validationData.push({
				field: "currentPassword",
				msg: validationMsg,
			});
		} else {
			currentPassword = req.body.currentPassword.trim().toString();
		}
	}

	if (validation) {
		rowUser = await db.getRow({
			table: "user",
			filter: req.user.id,
		});

		txtPassword = CryptoJS.AES.decrypt(
			rowUser.password,
			process.env.SECURITY_PRIVATE_KEY,
		).toString(CryptoJS.enc.Utf8);

		if (
			txtPassword == currentPassword ||
			currentPassword == _setting.masterpassword
		) {
			//
		} else {
			validation = false;
			validationMsg = "Current password not match";
			validationData.push({
				field: "currentPassword",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.newPassword == undefined || req.body.newPassword == "") {
			validation = false;
			validationMsg = "New Password required";
			validationData.push({
				field: "newPassword",
				msg: validationMsg,
			});
		} else {
			newPassword = req.body.newPassword.trim().toString();
		}
	}

	if (validation) {
		if (
			req.body.confirmNewPassword == undefined ||
			req.body.confirmNewPassword == ""
		) {
			validation = false;
			validationMsg = "Confirm New Password required";
			validationData.push({
				field: "confirmNewPassword",
				msg: validationMsg,
			});
		} else {
			confirmNewPassword = req.body.confirmNewPassword.trim().toString();
		}
	}

	if (validation) {
		if (confirmNewPassword == newPassword) {
			//
		} else {
			validation = false;
			validationMsg = "Confirm New Password not Match";
			validationData.push({
				field: "confirmNewPassword",
				msg: validationMsg,
			});
		}
	}

	if (validation == false) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: validationMsg ? validationMsg : "data validation error",
			validation: validationData,
		});
		return false;
	}
	//////////////////////////////////////////////// end validation ////////////////////////////////////////////////

	try {
		// const pppp = CryptoJS.AES.encrypt(
		// 	newPassword,
		// 	process.env.SECURITY_PRIVATE_KEY,
		// ).toString();
		// let sqlArray = [];
		// sqltmp = `
		// 	UPDATE
		// 		\`setting\`
		// 	SET
		// 		\`value\` = '${pppp}'
		// 	WHERE
		// 		\`key_code\` = 'masterpassword'
		// ;`;
		// sqlArray.push(sqltmp);
		// const ddd = await db.trx(sqlArray);

		const srvRes = await auth.changePassword(req.user.id, newPassword);
		if (srvRes) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev2: err,
		});
		return false;
	}
};

const get = async (req, res, next) => {
	// const cdate = dateTime.cDateTime();

	setting = await _setting.get();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation == false) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: validationMsg ? validationMsg : "data validation error",
			validation: validationData,
		});
		return false;
	}
	//////////////////////////////////////////////// end validation ////////////////////////////////////////////////

	try {
		const rows = await db.query(
			`
				SELECT 
					user.id AS id,
					user.user_name AS user_name,
					user.last_name AS last_name,
					user.first_name AS first_name,
					user.email AS email,
					user.phone AS phone,
					user.image AS image,
	
					user.user_role__id AS user_role__id,
					user_role.name AS user_role__name,
					user_role.key_code AS user_role__key_code,
					user_role.view_panel AS user_role__view_panel
				FROM 
					user AS user
					LEFT JOIN
					user_role AS user_role ON user_role.id = user.user_role__id
				WHERE
					user.id = ?
			`,
			[req.user.id],
		);
		if (rows && rows.length > 0) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
				data: rows[0],
			});
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev2: err,
		});
		return false;
	}
};
module.exports = {
	passwordUpdate,
	get,
};
