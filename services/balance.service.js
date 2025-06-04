require("dotenv").config();
const db = require("./db.service.js");
const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");

const currentBalance = async () => {
	let resultBankList = await db.query(
		`
			SELECT 
				\`id\`, 
				\`key_code\`, 
				\`name\`, 
				\`image\` 
			FROM 
				\`bank\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0
		`,
		[],
	);

	let sqlObj = {};

	sqlObj.payment_receive = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`payment\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`payment_receive\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	sqlObj.payment_send = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`amount\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`payment_send\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	sqlObj.expense = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`amount\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`expense\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	sqlObj.payment_return = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`amount\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`payment_return\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	sqlObj.user_balance = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`amount\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`user_balance\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	sqlObj.exchange_receive = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`receive_amount\`), 0) AS \`amount\`, 
				\`receive_bank__id\` AS \`bank\` 
			FROM 
				\`user_bank_exchange\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`receive_bank__id\`
		`,
		[],
	);

	sqlObj.exchange_send = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`send_amount\`), 0) AS \`amount\`, 
				\`send_bank__id\` AS \`bank\` 
			FROM 
				\`user_bank_exchange\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`send_bank__id\`
		`,
		[],
	);

	sqlObj.withdraw = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`amount\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`withdraw\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	sqlObj.addbalance = await db.query(
		`
			SELECT 
				IFNULL(SUM(\`amount\`), 0) AS \`amount\`, 
				\`bank__id\` AS \`bank\` 
			FROM 
				\`addbalance\` 
			WHERE 
				\`is_active\` = 1 
				AND 
				\`is_delete\` = 0 
			GROUP BY 
				\`bank__id\`
		`,
		[],
	);

	inclueArr = [
		"exchange_send",
		"payment_send",
		"payment_return",
		"expense",
		"withdraw",
	];

	if (resultBankList && resultBankList.length > 0) {
		resultBankList.forEach((ele1, idx1) => {
			sumTmp = 0;
			if (Object.keys(sqlObj).length > 0) {
				for (const [key, value] of Object.entries(sqlObj)) {
					if (value.length > 0) {
						value.forEach((ele2, idx2) => {
							if (ele2.bank == ele1.id) {
								if (inclueArr.includes(key, 0)) {
									sumTmp -= nf.dec(ele2.amount);
								} else {
									sumTmp += nf.dec(ele2.amount);
								}
							}
						});
					}
				}
			}
			resultBankList[idx1].balance = nf.dec(sumTmp);
		});
		return {
			error: false,
			type: "success",
			msg: "success",
			data: resultBankList,
		};
	} else {
		return {
			error: true,
			type: "error",
			msg: "no bank found",
		};
	}
};

module.exports = {
	currentBalance,
};
