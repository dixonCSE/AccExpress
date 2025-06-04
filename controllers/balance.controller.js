require("dotenv").config();

const db = require("../services/db.service.js");
const _setting = require("../services/setting.service.js");
const _balance = require("../services/balance.service.js");

const balance = async (req, res, next) => {
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
		bankBalance = await _balance.currentBalance();
		if (bankBalance.error == false) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
				data: bankBalance.data,
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "service error",
				err: bankBalance,
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev2: err,
		});
		return true;
	}
};
module.exports = {
	balance,
};
