require("dotenv").config();

const db = require("../services/db.service.js");
const nf = require("../utils/numberFormat.util.js");

const recalBill = async (billId = false) => {
	if (billId) {
		totalPay = await db.colSum({
			table: "payment_send",
			col: "amount",
			filter: {
				vendor__id: billId,
				vendor_type: "bill",
				is_delete: 0,
			},
		});
		let tempRest = totalPay;

		totalBillAmount = await db.colSum({
			table: "bill_get",
			col: "amount",
			filter: {
				bill__id: billId,
				is_delete: 0,
			},
		});

		rowsBillGet = await db.getRows({
			table: "bill_get",
			filter: {
				bill__id: billId,
				is_delete: 0,
			},
			sortCol: "id",
			sortDir: "ASC",
		});

		tmpSqlres = await db.query(
			`
				UPDATE 
					\`bill_get\` 
				SET 
					\`pay_amount\` = 0
				WHERE 
					\`bill__id\` = ${billId}
			`,
			[],
		);
		totalPayment = 0;
		let sqlArray = [];
		let sqltmp;
		rowsBillGet.forEach((element) => {
			totalPayment += nf.dec(element.amount);
			tmpAmount = nf.dec(element.amount);
			if (tmpAmount <= tempRest) {
				newPayment = tmpAmount;
			} else {
				newPayment = tempRest;
			}
			tempRest = tempRest - newPayment;

			sqltmp = `
				UPDATE 
					\`bill_get\` 
				SET 
					\`pay_amount\` = ${newPayment}
				WHERE 
					\`id\` = ${element.id}
				;
			`;
			sqlArray.push(sqltmp);
		});

		try {
			const sqlres = await db.trx(sqlArray);
			if (sqlres) {
				return {
					error: false,
					type: "success",
					msg: "success",
				};
			} else {
				return {
					error: true,
					type: "error",
					msg: "sql error",
				};
			}
		} catch (err) {
			return {
				error: true,
				type: "error",
				msg: "db transaction try error",
				dev: sqlArray,
				dev2: err,
			};
		}
	} else {
		return {
			error: true,
			type: "error",
			msg: "billId not found",
		};
	}
};

module.exports = {
	recalBill,
};
