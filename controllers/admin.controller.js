require("dotenv").config();
const db = require("../services/db.service");
const nf = require("../utils/numberFormat.util.js");
// const _setting = require("../services/setting.service.js");
const _balance = require("../services/balance.service.js");
const totalService = require("../services/total.service");

const dashboard = async (req, res, next) => {
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
		resData = {};

		// setting = await _setting.get();
		bankBalance = await _balance.currentBalance();
		if (bankBalance.error == false) {
			resData.bankBalance = bankBalance.data;
		} else {
			resData.bankBalance = false;
		}

		resData.totalSale = await totalService.totalSale();
		resData.totalSaleCount = await totalService.countSale();
		resData.totalDue = await totalService.totalDue();
		resData.totalAdv = await totalService.totalAdv();
		resData.totalPaid = await totalService.totalPaid();
		resData.totalExpense = await totalService.totalExpense();
		resData.totalUser = await totalService.totalUser();

		resData.totalExpenseList = await db.query(
			`
				SELECT 
					IFNULL(SUM(\`expense\`.\`amount\`), 0) AS \`amount\`, 
					\`expense\`.\`bank__id\` AS \`bank\`, 
					\`bank\`.\`name\` AS \`bank__name\` 
				FROM 
					\`expense\` AS \`expense\`
					LEFT JOIN \`bank\` ON \`bank\`.\`id\` = \`expense\`.\`bank__id\`
				WHERE 
					\`expense\`.\`is_delete\` = 0 
				GROUP BY 
					\`expense\`.\`bank__id\`
			`,
			[],
		);

		res.status(200).json({
			error: false,
			type: "success",
			msg: "success",
			data: resData,
		});
		return true;
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

const get = async (req, res, next) => {
	try {
		res.json(await user.get(req.user.id));
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
};

const userData = async (req, res, next) => {
	try {
		id = req.user.id;
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
			[id],
		);
		const data = await rows[0];

		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await data,
		});
		return true;
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
};

const gets = async (req, res, next) => {
	try {
		res.json(await user.gets(req.query.page));
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
};

async function create(req, res, next) {
	try {
		res.json(await user.insert(req.body));
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
}

async function update(req, res, next) {
	try {
		res.json(await user.update(req.params.id, req.body));
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
}

async function remove(req, res, next) {
	try {
		res.json(await user.remove(req.params.id));
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
}

module.exports = {
	dashboard,
	get,
	userData,
	gets,
	create,
	update,
	remove,
};
