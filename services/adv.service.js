require("dotenv").config();
const db = require("./db.service.js");
const nf = require("../utils/numberFormat.util.js");

const getBUser = async (user__id = false) => {
	xDue = await db.colSum({
		table: "previous_due_adv",
		col: "amount",
		filter: {
			user__id: user__id,
			"amount >": 0,
			is_delete: 0,
			is_due: 1,
		},
	});

	Pay = await db.colSum({
		table: "payment_receive",
		col: "payment",
		filter: {
			user__id: user__id,
			is_delete: 0,
		},
	});

	serviceAmt = await db.colSum({
		table: "user_service",
		col: "net",
		filter: {
			user__id: user__id,
			is_delete: 0,
		},
	});

	total = Pay - serviceAmt - xDue;

	if (total < 0) {
		total = 0;
	}

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const getAll = async (user__id = false) => {
	xDue = await db.colSum({
		table: "previous_due_adv",
		col: "amount",
		filter: {
			is_delete: 0,
			is_due: 1,
		},
	});

	Pay = await db.colSum({
		table: "payment_receive",
		col: "payment_receive",
		filter: {
			is_delete: 0,
		},
	});

	serviceAmt = await db.colSum({
		table: "user_service",
		col: "net",
		filter: {
			is_delete: 0,
		},
	});

	total = Pay - serviceAmt - xDue;

	if (total < 0) {
		total = 0;
	}

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

module.exports = {
	getBUser,
	getAll,
};
