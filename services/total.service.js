require("dotenv").config();
const db = require("./db.service.js");
const nf = require("../utils/numberFormat.util.js");

const totalSale = async () => {
	total = await db.colSum({
		table: "user_service",
		col: "net",
		filter: {
			is_delete: 0,
		},
	});

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const countSale = async () => {
	total = await db.rowCount({
		table: "user_service",
		filter: {
			is_delete: 0,
		},
	});

	return parseInt(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalPaid = async () => {
	total = await db.colSum({
		table: "payment_receive",
		col: "payment",
		filter: {
			is_delete: 0,
		},
	});

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalAdv = async () => {
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
				col: "payment",
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

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalDue = async () => {
	try {
		const [oldDue, Pay, serviceAmount] = await Promise.all([
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
				col: "payment",
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

const totalDueByUser = async (user__id = false) => {
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

const OldDueByUser = async (user__id = false) => {
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

const totalAdvByUser = async (user__id = false) => {
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

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalPaidByUser = async (user__id = false) => {
	total = await db.colSum({
		table: "payment_receive",
		col: "payment",
		filter: {
			user__id: user__id,
			is_delete: 0,
		},
	});

	return total;

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalSaleByUser = async (user__id = false) => {
	total = await db.colSum({
		table: "user_service",
		col: "net",
		filter: {
			user__id: user__id,
			is_delete: 0,
		},
	});

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const countSaleByUser = async (user__id = false) => {
	total = await db.rowCount({
		table: "user_service",
		filter: {
			user__id: user__id,
			is_delete: 0,
		},
	});

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalExpense = async () => {
	total = await db.colSum({
		table: "expense",
		col: "amount",
		filter: {
			is_delete: 0,
		},
	});

	return nf.dec(total);

	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

const totalUser = async () => {
	try {
		const totalUser = await db.query(
			`
			SELECT 
				IFNULL(COUNT(\`id\`), 0) AS \`count\`
			FROM 
				\`user\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
				AND
				\`user_role__id\` IN (
						SELECT \`id\` FROM \`user_role\` WHERE \`key_code\` = 'user'
				)
		`,
			[],
		);

		if (totalUser != false && totalUser.length > 0) {
			total = parseInt(totalUser[0].count);
		} else {
			total = 0;
		}
		return total;
	} catch (err) {
		console.log(err);
	}
	// return {
	// 	data: oldDue,
	// 	error: false,
	// 	type: "success",
	// 	msg: "successfully fetch data",
	// };
};

module.exports = {
	countSale,
	totalSale,
	totalPaid,
	totalAdv,
	totalDue,
	countSaleByUser,
	OldDueByUser,
	totalSaleByUser,
	totalPaidByUser,
	totalAdvByUser,
	totalDueByUser,
	totalExpense,
	totalUser,
};
