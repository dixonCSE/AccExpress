require("dotenv").config();
const db = require("./db.service.js");
const nf = require("../utils/numberFormat.util.js");

const getOld = async (user__id = false) => {
	try {
		const [oldDue, duePay] = await Promise.all([
			db.colSum({
				table: "previous_due_adv",
				col: "amount",
				filter: {
					user__id: user__id,
					is_delete: 0,
					is_due: 1,
				},
			}),
			db.colSum({
				table: "due_pay",
				col: "amount",
				filter: {
					user__id: user__id,
					is_delete: 0,
				},
			}),
		]);
		console.log(oldDue, duePay);
		total = nf.dec(nf.dec(oldDue) - nf.dec(duePay));
		if (total < 0) {
			total = nf.dec(0);
		}
		return total;
	} catch (error) {
		console.error("One of the try failed:", error);
		return 0;
	}

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const getTotal = async (user__id = false) => {
	try {
		const [oldDue, Pay, serviceAmount] = await Promise.all([
			db.colSum({
				table: "previous_due_adv",
				col: "amount",
				filter: {
					user__id: user__id,
					is_delete: 0,
					is_due: 1,
				},
			}),
			db.colSum({
				table: "payment_receive",
				col: "payment",
				filter: {
					user__id: user__id,
					is_delete: 0,
				},
			}),
			db.colSum({
				table: "user_service",
				col: "net",
				filter: {
					user__id: user__id,
					is_delete: 0,
				},
			}),
		]);
		console.log(oldDue, Pay, serviceAmount);
		total = nf.dec(nf.dec(oldDue) - nf.dec(Pay) + nf.dec(serviceAmount));
		if (total < 0) {
			total = nf.dec(0);
		}
		return total;
	} catch (error) {
		console.error("One of the try failed:", error);
		return 0;
	}

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
