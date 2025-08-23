require("dotenv").config();
const db = require("./db.service.js");
const nf = require("../utils/numberFormat.util.js");

const getBUser = async (user__id = false) => {
	try {
		const [xDue, Pay, serviceAmt] = await Promise.all([
			db.colSum({
				table: "previous_due_adv",
				col: "amount",
				filter: {
					user__id: user__id,
					"amount >": 0,
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

		total = nf.dec(nf.dec(Pay) - nf.dec(serviceAmt) - nf.dec(xDue));

		if (total < 0) {
			total = nf.dec(0);
		}
		return total;
	} catch (error) {
		console.error("One of the try failed:", error);
		return 0;
	}
};

const getAll = async (user__id = false) => {
	try {
		const [xDue, Pay, serviceAmt] = await Promise.all([
			db.colSum({
				table: "previous_due_adv",
				col: "amount",
				filter: {
					is_delete: 0,
					is_due: 1,
				},
			}),
			db.colSum({
				table: "payment_receive",
				col: "payment_receive",
				filter: {
					is_delete: 0,
				},
			}),
			db.colSum({
				table: "user_service",
				col: "net",
				filter: {
					is_delete: 0,
				},
			}),
		]);

		total = nf.dec(nf.dec(Pay) - nf.dec(serviceAmt) - nf.dec(xDue));

		if (total < 0) {
			total = nf.dec(0);
		}
		return total;
	} catch (error) {
		console.error("One of the try failed:", error);
		return 0;
	}
};

module.exports = {
	getBUser,
	getAll,
};
