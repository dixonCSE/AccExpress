require("dotenv").config();
const db = require("./db.service.js");
const nf = require("../utils/numberFormat.util.js");

const getOld = async (user__id = false) => {
	oldDue = nf.dec(
		await db.colSum({
			table: "previous_due_adv",
			col: "amount",
			filter: {
				user__id: user__id,
				is_delete: 0,
				is_due: 1,
			},
		}),
	);

	duePay = nf.dec(
		await db.colSum({
			table: "due_pay",
			col: "amount",
			filter: {
				user__id: user__id,
				is_delete: 0,
			},
		}),
	);

	total = nf.dec(oldDue - duePay);

	if (total < 0) {
		total = 0;
	}

	return total;

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const getTotal = async (user__id = false) => {
	oldDue = nf.dec(
		await db.colSum({
			table: "previous_due_adv",
			col: "amount",
			filter: {
				user__id: user__id,
				is_delete: 0,
				is_due: 1,
			},
		}),
	);

	Pay = nf.dec(
		await db.colSum({
			table: "payment_receive",
			col: "payment",
			filter: {
				user__id: user__id,
				is_delete: 0,
			},
		}),
	);

	serviceAmount = nf.dec(
		await db.colSum({
			table: "user_service",
			col: "net",
			filter: {
				user__id: user__id,
				is_delete: 0,
			},
		}),
	);

	total = nf.dec(oldDue - Pay + serviceAmount);

	if (total < 0) {
		total = 0;
	}

	//console.log(`total = ${oldDue} - ${Pay} + ${serviceAmount}`);

	return total;

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

module.exports = {
	getOld,
	getTotal,
};
