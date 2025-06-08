require("dotenv").config();

const datexTime = require("date-and-time");

const db = require("../services/db.service.js");
const helper = require("../utils/dbHelper.util.js");
const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");
const billService = require("../services/bill.service.js");

const DataTable = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	srcStr = "";
	if (search) {
		srcStr = `
			( 
				\`t1\`.\`amount\` LIKE '%${search}%' 
				OR 
				\`t1\`.\`name\` LIKE '%${search}%'
				OR 
				\`bill\`.\`name\` LIKE '%${search}%'
			) 
			AND 
		`;
	}

	const rows = await db.query(
		`
			SELECT 
				\`t1\`.\`id\` AS \`id\`, 
				\`t1\`.\`name\` AS \`name\`, 
				\`t1\`.\`bill__id\` AS \`bill__id\`,
				\`t1\`.\`amount\` AS \`amount\`,
				\`t1\`.\`pay_amount\` AS \`pay_amount\`,
				\`t1\`.\`status__id\` AS \`status__id\`,
				\`t1\`.\`datestr\` AS \`datestr\`,
				\`t1\`.\`dateint\` AS \`dateint\`,
				\`t1\`.\`start_date\` AS \`start_date\`,
				\`t1\`.\`end_date\` AS \`end_date\`,
				\`t1\`.\`duration\` AS \`duration\`,
				\`t1\`.\`is_fixed\` AS \`is_fixed\`,
				\`t1\`.\`auto_renew\` AS \`auto_renew\`,
				\`t1\`.\`is_closed\` AS \`is_closed\`,
				\`t1\`.\`is_onetime\` AS \`is_onetime\`,
				\`t1\`.\`renew_date\` AS \`renew_date\`,
				\`t1\`.\`renew_amount\` AS \`renew_amount\`,
				\`t1\`.\`remind_date\` AS \`remind_date\`,
				\`t1\`.\`note\` AS \`note\`,
				\`t1\`.\`created_date\` AS \`created_date\`,

				\`bill\`.\`name\` AS \`bill__name\`,
				\`bill\`.\`bill_type__id\` AS \`bill_type__id\`,
				\`status\`.\`name\` AS \`status__name\`
			FROM 
				\`bill_get\` AS \`t1\` 
				LEFT JOIN \`status\` AS \`status\` ON \`status\`.\`id\` = \`t1\`.\`status__id\`
				LEFT JOIN \`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
			WHERE
				${srcStr}
				\`t1\`.\`is_delete\` = 0
			ORDER BY ${sort_col} ${sort_dir}
			LIMIT ${offset},${limit}
		`,
		[],
	);

	const count = await db.query(
		`
			SELECT 
				IFNULL(COUNT(\`t1\`.\`id\`), 0) AS \`cnt\`
			FROM 
				\`bill_get\` AS \`t1\` 
				LEFT JOIN \`status\` AS \`status\` ON \`status\`.\`id\` = \`t1\`.\`status__id\`
				LEFT JOIN \`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
			WHERE
				${srcStr}
				\`t1\`.\`is_delete\` = 0
		`,
		[],
	);

	const data = helper.emptyOrRows(rows);
	const meta = {
		offset: offset,
		limit: limit,
		count: count[0].cnt,
		search: search,
		sort_col: sort_col,
		sort_dir: sort_dir,
	};

	return {
		data,
		meta,
	};
};

const List = async (req, res, next) => {
	try {
		const sqlRes = await DataTable(req.query);

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes.data,
			count: sqlRes.meta.count,
		});
		return true;
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return true;
	}
};

const View = async (req, res, next) => {
	try {
		const rows = await db.getRow({
			table: "bill_get",
			filter: req.params.id,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: rows,
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

const Get = async (req, res, next) => {
	const rows = await db.getRow({
		table: "bill_get",
		filter: req.params.id,
	});

	try {
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: rows,
		});
		return true;
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const Gets = async (req, res, next) => {
	try {
		const sqlRes = await db.getRows({
			table: "bill_get",
			filter: {
				is_delete: 0,
			},
		});

		if (sqlRes == false) {
			res.status(404).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return true;
		}

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes,
		});
		return true;
	} catch (err) {
		// next(err);
		res.status(500).json({
			error: true,
			type: "error",
			msg: "error",
		});
		return true;
	}
};

const Insert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.bill__id === undefined ||
			req.body.bill__id == "" ||
			req.body.bill__id === null
		) {
			validation = false;
			validationMsg = "Bill required";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		} else {
			bill__id = req.body.bill__id;
		}
	}

	if (validation) {
		bill__id = parseInt(bill__id);
		if (bill__id === undefined || isNaN(bill__id) || bill__id < 1) {
			validation = false;
			validationMsg = "Bill is not valid";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowbill = await db.getRow({
			table: "bill",
			filter: bill__id,
		});

		if (rowbill == false) {
			validation = false;
			validationMsg = "Bill is not found";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			bank__id = req.body.bank__id;
		}
	}

	if (validation) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowBank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.amount === undefined ||
			req.body.amount == "" ||
			req.body.amount === null
		) {
			validation = false;
			validationMsg = "Add amount required";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = req.body.amount;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount === undefined || isNaN(amount)) {
			validation = false;
			validationMsg = "Add amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = nf.dec(amount);
		}
	}

	if (validation) {
		if (amount < 0) {
			validation = false;
			validationMsg = "Add amount < 0";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.startDate === undefined ||
			req.body.startDate == "" ||
			req.body.startDate === null
		) {
			validation = false;
			validationMsg = "Start Date required";
			validationData.push({
				field: "startDate",
				msg: validationMsg,
			});
		} else {
			startDate = datexTime.format(
				new Date(req.body.startDate),
				"YYYY-MM-DD HH:mm:ss",
			);
			startDate2 = datexTime.format(new Date(req.body.startDate), "YYYY-MM-DD");
		}
	}

	if (validation) {
		if (
			req.body.duration === undefined ||
			req.body.duration == "" ||
			req.body.duration === null
		) {
			validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		} else {
			duration = req.body.duration;
		}
	}

	if (validation) {
		duration = parseInt(duration);
		if (duration === undefined || isNaN(duration)) {
			validation = false;
			validationMsg = "Bill duration is not valid";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		minDuration = 1;
		if (duration < minDuration) {
			validation = false;
			validationMsg = `Bill duration minimum ${minDuration} days`;
			validationData.push({
				field: "duration",
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		INSERT INTO 
			\`bill_pay\` (
				\`bill__id\`,
				\`bank__id\`,
				\`wallet__id\`,
				\`amount\`,

				\`note\`,
				\`creator__id\`,
				\`created_date\`
			) VALUES (
				${bill__id},
				${bank__id},
				11,
				${amount},

				${note},
				${req.user.id},
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const InsertT1 = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.bill__id === undefined ||
			req.body.bill__id == "" ||
			req.body.bill__id === null
		) {
			validation = false;
			validationMsg = "Bill required";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		} else {
			bill__id = req.body.bill__id;
		}
	}

	if (validation) {
		bill__id = parseInt(bill__id);
		if (bill__id === undefined || isNaN(bill__id) || bill__id < 1) {
			validation = false;
			validationMsg = "Bill is not valid";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowbill = await db.getRow({
			table: "bill",
			filter: bill__id,
		});

		if (rowbill == false) {
			validation = false;
			validationMsg = "Bill is not found";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.name === undefined ||
			req.body.name == "" ||
			req.body.name === null
		) {
			nameStr = `null`;
		} else {
			nameStr = `'${req.body.name.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			/* 
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			}); 
			*/
			t2 = false;
		} else {
			t2 = true;
			bank__id = req.body.bank__id;
		}
	}

	if (validation && t2) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation && t2) {
		rowBank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.amount === undefined ||
			req.body.amount == "" ||
			req.body.amount === null
		) {
			validation = false;
			validationMsg = "Amount required";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = req.body.amount;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount === undefined || isNaN(amount) || amount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = nf.dec(amount);
		}
	}

	if (validation) {
		if (
			req.body.renewAmount === undefined ||
			req.body.renewAmount == "" ||
			req.body.renewAmount === null
		) {
			// validation = false;
			// validationMsg = "Amount required";
			// validationData.push({
			// 	field: "renewAmount",
			// 	msg: validationMsg,
			// });
			renewAmount = 0;
		} else {
			renewAmount = req.body.renewAmount;
		}
	}

	if (validation) {
		renewAmount = parseFloat(renewAmount);
		if (renewAmount === undefined || isNaN(renewAmount) || renewAmount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "renewAmount",
				msg: validationMsg,
			});
		} else {
			renewAmount = nf.dec(renewAmount);
		}
	}

	if (validation) {
		if (
			req.body.payAmount === undefined ||
			req.body.payAmount == "" ||
			req.body.payAmount === null
		) {
			if (t2) {
				validation = false;
				validationMsg = "Payment required";
				validationData.push({
					field: "payAmount",
					msg: validationMsg,
				});
			} else {
				payAmount = 0;
			}
		} else {
			payAmount = req.body.payAmount;
		}
	}

	if (validation) {
		payAmount = parseFloat(payAmount);
		if (payAmount === undefined || isNaN(payAmount) || payAmount < 0) {
			validation = false;
			validationMsg = "Payment is not valid";
			validationData.push({
				field: "payAmount",
				msg: validationMsg,
			});
		} else {
			payAmount = nf.dec(payAmount);
			if (payAmount <= 0.1) {
				t2 = false;
			}
		}
	}

	if (validation) {
		if (
			req.body.trxid === undefined ||
			req.body.trxid == "" ||
			req.body.trxid === null
		) {
			trxid = `null`;
		} else {
			trxid = `'${req.body.trxid.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.dateInt === undefined ||
			req.body.dateInt == "" ||
			req.body.dateInt === null
		) {
			validation = false;
			validationMsg = "Date required";
			validationData.push({
				field: "dateStr",
				msg: validationMsg,
			});
		} else {
			dateInt = Number(req.body.dateInt);
		}
	}

	if (validation) {
		if (
			req.body.dateStr === undefined ||
			req.body.dateStr == "" ||
			req.body.dateStr === null
		) {
			validation = false;
			validationMsg = "Date required";
			validationData.push({
				field: "dateStr",
				msg: validationMsg,
			});
		} else {
			dateStr = req.body.dateStr.str.toString();

			start_date = datexTime.format(
				datexTime.parse(dateStr, "YYYY - MMMM"),
				"YYYY-MM-01 00:00:00",
			);
			tmpDate = datexTime.format(
				datexTime.addMonths(new Date(start_date), 1),
				"YYYY-MM-DD 00:00:00",
			);
			renew_date = tmpDate;
			end_date = datexTime.format(
				datexTime.addDays(new Date(tmpDate), -1),
				"YYYY-MM-DD 23:59:59",
			);
		}
	}

	if (validation) {
		if (
			req.body.auto_renew === undefined ||
			req.body.auto_renew == "" ||
			req.body.auto_renew === null
		) {
			auto_renew = false;
			autoRenew = 0;
		} else {
			auto_renew = !!req.body.auto_renew;
			autoRenew = auto_renew ? 1 : 0;
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		INSERT INTO 
			\`bill_get\` (
				\`bill__id\`,

				\`name\`,
				\`amount\`,
				\`pay_amount\`,

				\`datestr\`,
				\`dateint\`,
				
				\`status__id\`,
				\`is_fixed\`,
				\`is_closed\`,
				\`is_onetime\`,
				\`set_amount\`,

				\`start_date\`,
				\`end_date\`,

				\`renew_date\`,
				\`auto_renew\`,
				\`renew_amount\`,
				\`remind_date\`,

				\`note\`,
				\`created_date\`
			) VALUES (
				${bill__id},

				${nameStr},
				${amount},
				${amount},

				'${dateStr}',
				${dateInt},

				1,
				0,
				0,
				0,
				1,

				'${start_date}',
				'${end_date}',

				'${renew_date}',
				${autoRenew},
				${renewAmount},
				'${renew_date}',

				${note},
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	if (t2) {
		sqltmp = `
			INSERT INTO 
				\`payment_send\` (
					\`creator__id\`,
					\`vendor__id\`,
					\`vendor_type\`,

					\`wallet__id\`,
					\`bank__id\`,
					\`amount\`,
					
					\`trxid\`,
					\`note\`,
					\`created_date\`
				) VALUES (
					${req.user.id},
					${bill__id},
					'bill',

					11,
					${bank__id},
					${payAmount},

					${trxid},
					${note},
					'${cdate}'
				);
		`;
		sqlArray.push(sqltmp);
	}

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			resTmp = await billService.recalBill(bill__id);
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const UpdateT1 = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.id === undefined ||
			req.body.id == "" ||
			req.body.id === null
		) {
			validation = false;
			validationMsg = "Data ID required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			id = req.body.id;
		}
	}

	if (validation) {
		id = parseInt(id);
		if (id === undefined || isNaN(id) || id < 1) {
			validation = false;
			validationMsg = "Data ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bill_get",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Data ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.bill__id === undefined ||
			req.body.bill__id == "" ||
			req.body.bill__id === null
		) {
			validation = false;
			validationMsg = "Bill required";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		} else {
			bill__id = req.body.bill__id;
		}
	}

	if (validation) {
		bill__id = parseInt(bill__id);
		if (bill__id === undefined || isNaN(bill__id) || bill__id < 1) {
			validation = false;
			validationMsg = "Bill is not valid";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowbill = await db.getRow({
			table: "bill",
			filter: bill__id,
		});

		if (rowbill == false) {
			validation = false;
			validationMsg = "Bill is not found";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.name === undefined ||
			req.body.name == "" ||
			req.body.name === null
		) {
			nameStr = `null`;
		} else {
			nameStr = `'${req.body.name.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.amount === undefined ||
			req.body.amount == "" ||
			req.body.amount === null
		) {
			validation = false;
			validationMsg = "Amount required";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = req.body.amount;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount === undefined || isNaN(amount) || amount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = nf.dec(amount);
		}
	}

	if (validation) {
		if (
			req.body.renewAmount === undefined ||
			req.body.renewAmount == "" ||
			req.body.renewAmount === null
		) {
			validation = false;
			validationMsg = "Amount required";
			validationData.push({
				field: "renewAmount",
				msg: validationMsg,
			});
		} else {
			renewAmount = req.body.renewAmount;
		}
	}

	if (validation) {
		renewAmount = parseFloat(renewAmount);
		if (renewAmount === undefined || isNaN(renewAmount) || renewAmount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "renewAmount",
				msg: validationMsg,
			});
		} else {
			renewAmount = nf.dec(renewAmount);
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.dateInt === undefined ||
			req.body.dateInt == "" ||
			req.body.dateInt === null
		) {
			validation = false;
			validationMsg = "Date required";
			validationData.push({
				field: "dateStr",
				msg: validationMsg,
			});
		} else {
			dateInt = Number(req.body.dateInt);
		}
	}

	if (validation) {
		if (
			req.body.dateStr === undefined ||
			req.body.dateStr == "" ||
			req.body.dateStr === null
		) {
			validation = false;
			validationMsg = "Date required";
			validationData.push({
				field: "dateStr",
				msg: validationMsg,
			});
		} else {
			dateStr = req.body.dateStr.str.toString();

			start_date = datexTime.format(
				datexTime.parse(dateStr, "YYYY - MMMM"),
				"YYYY-MM-01 00:00:00",
			);
			tmpDate = datexTime.format(
				datexTime.addMonths(new Date(start_date), 1),
				"YYYY-MM-DD 00:00:00",
			);
			renew_date = tmpDate;
			end_date = datexTime.format(
				datexTime.addDays(new Date(tmpDate), -1),
				"YYYY-MM-DD 23:59:59",
			);
		}
	}

	if (validation) {
		if (
			req.body.auto_renew === undefined ||
			req.body.auto_renew == "" ||
			req.body.auto_renew === null
		) {
			auto_renew = false;
			autoRenew = 0;
		} else {
			auto_renew = !!req.body.auto_renew;
			autoRenew = auto_renew ? 1 : 0;
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE
			\`bill_get\`
		SET
			\`bill__id\` = ${bill__id},
			\`name\` = ${nameStr},
			\`amount\` = ${amount},
			\`datestr\` = '${dateStr}',
			\`dateint\` = ${dateInt},
			\`start_date\` = '${start_date}',
			\`end_date\` = '${end_date}',
			\`renew_date\` = '${renew_date}',
			\`auto_renew\` = ${autoRenew},
			\`renew_amount\` = ${renewAmount},
			\`note\` = ${note},
			\`updated_date\` = '${cdate}'
		WHERE
			\`id\` = ${id};
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			resTmp = await billService.recalBill(bill__id);
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const InsertT2 = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.bill__id === undefined ||
			req.body.bill__id == "" ||
			req.body.bill__id === null
		) {
			validation = false;
			validationMsg = "Bill required";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		} else {
			bill__id = req.body.bill__id;
		}
	}

	if (validation) {
		bill__id = parseInt(bill__id);
		if (bill__id === undefined || isNaN(bill__id) || bill__id < 1) {
			validation = false;
			validationMsg = "Bill is not valid";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowbill = await db.getRow({
			table: "bill",
			filter: bill__id,
		});

		if (rowbill == false) {
			validation = false;
			validationMsg = "Bill is not found";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.billName === undefined ||
			req.body.billName == "" ||
			req.body.billName === null
		) {
			nameStr = `null`;
		} else {
			nameStr = `'${req.body.billName.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			/* 
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			}); 
			*/
			t2 = false;
		} else {
			t2 = true;
			bank__id = req.body.bank__id;
		}
	}

	if (validation && t2) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation && t2) {
		rowBank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.amount === undefined ||
			req.body.amount == "" ||
			req.body.amount === null
		) {
			validation = false;
			validationMsg = "Amount required";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = req.body.amount;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount === undefined || isNaN(amount) || amount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = nf.dec(amount);
		}
	}

	if (validation) {
		if (
			req.body.renewAmount === undefined ||
			req.body.renewAmount == "" ||
			req.body.renewAmount === null
		) {
			// validation = false;
			// validationMsg = "Amount required";
			// validationData.push({
			// 	field: "renewAmount",
			// 	msg: validationMsg,
			// });
			renewAmount = 0;
		} else {
			renewAmount = req.body.renewAmount;
		}
	}

	if (validation) {
		renewAmount = parseFloat(renewAmount);
		if (renewAmount === undefined || isNaN(renewAmount) || renewAmount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "renewAmount",
				msg: validationMsg,
			});
		} else {
			renewAmount = nf.dec(renewAmount);
		}
	}

	if (validation) {
		if (
			req.body.payAmount === undefined ||
			req.body.payAmount == "" ||
			req.body.payAmount === null
		) {
			if (t2) {
				validation = false;
				validationMsg = "Payment required";
				validationData.push({
					field: "payAmount",
					msg: validationMsg,
				});
			} else {
				payAmount = 0;
			}
		} else {
			payAmount = req.body.payAmount;
		}
	}

	if (validation) {
		payAmount = parseFloat(payAmount);
		if (payAmount === undefined || isNaN(payAmount) || payAmount < 0) {
			validation = false;
			validationMsg = "Payment is not valid";
			validationData.push({
				field: "payAmount",
				msg: validationMsg,
			});
		} else {
			payAmount = nf.dec(payAmount);
			if (payAmount <= 0.1) {
				t2 = false;
			}
		}
	}

	if (validation) {
		if (
			req.body.trxid === undefined ||
			req.body.trxid == "" ||
			req.body.trxid === null
		) {
			trxid = `null`;
		} else {
			trxid = `'${req.body.trxid.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.startDate === undefined ||
			req.body.startDate == "" ||
			req.body.startDate === null
		) {
			validation = false;
			validationMsg = "Start Date required";
			validationData.push({
				field: "startDate",
				msg: validationMsg,
			});
		} else {
			startDate = datexTime.format(
				new Date(req.body.startDate),
				"YYYY-MM-DD 00:00:00",
			);
			startDate2 = datexTime.format(new Date(req.body.startDate), "YYYY-MM-DD");
		}
	}

	if (validation) {
		if (
			req.body.duration === undefined ||
			req.body.duration == "" ||
			req.body.duration === null
		) {
			validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		} else {
			duration = req.body.duration;
		}
	}

	if (validation) {
		duration = parseInt(duration);
		if (duration === undefined || isNaN(duration)) {
			validation = false;
			validationMsg = "Service duration is not valid";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		minDuration = 1;
		if (duration < minDuration) {
			validation = false;
			validationMsg = `Service duration minimum ${minDuration} days`;
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.auto_renew === undefined ||
			req.body.auto_renew == "" ||
			req.body.auto_renew === null
		) {
			auto_renew = false;
			autoRenew = 0;
		} else {
			auto_renew = !!req.body.auto_renew;
			autoRenew = auto_renew ? 1 : 0;
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

	remindBefore = 2;
	xduration = duration - 1;
	rduration = xduration - remindBefore;
	endDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), xduration),
		"YYYY-MM-DD 23:59:59",
	);
	endDate2 = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), xduration),
		"YYYY-MM-DD",
	);

	remindDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), rduration),
		"YYYY-MM-DD 23:59:59",
	);
	renewDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), duration),
		"YYYY-MM-DD 00:00:00",
	);
	renewDate2 = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), duration),
		"YYYY-MM-DD",
	);

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		INSERT INTO 
			\`bill_get\` (
				\`bill__id\`,

				\`name\`,
				\`amount\`,
				\`pay_amount\`,
				
				\`status__id\`,
				\`is_fixed\`,
				\`is_closed\`,
				\`is_onetime\`,
				\`set_amount\`,

				\`start_date\`,
				\`end_date\`,
				\`duration\`,

				\`renew_date\`,
				\`auto_renew\`,
				\`renew_amount\`,
				\`remind_date\`,

				\`note\`,
				\`created_date\`
			) VALUES (
				${bill__id},

				${nameStr},
				${amount},
				${payAmount},

				1,
				0,
				0,
				0,
				1,

				'${startDate}',
				'${endDate}',
				${duration},

				'${renewDate}',
				${autoRenew},
				${renewAmount},
				'${remindDate}',

				${note},
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	if (t2) {
		sqltmp = `
			INSERT INTO 
				\`payment_send\` (
					\`creator__id\`,
					\`vendor__id\`,
					\`vendor_type\`,

					\`wallet__id\`,
					\`bank__id\`,
					\`amount\`,
					
					\`trxid\`,
					\`note\`,
					\`created_date\`
				) VALUES (
					${req.user.id},
					${bill__id},
					'bill',

					11,
					${bank__id},
					${payAmount},

					${trxid},
					${note},
					'${cdate}'
				);
		`;
		sqlArray.push(sqltmp);
	}
	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			resTmp = await billService.recalBill(bill__id);
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sqlres error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const UpdateT2 = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.id === undefined ||
			req.body.id == "" ||
			req.body.id === null
		) {
			validation = false;
			validationMsg = "Data ID required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			id = req.body.id;
		}
	}

	if (validation) {
		id = parseInt(id);
		if (id === undefined || isNaN(id) || id < 1) {
			validation = false;
			validationMsg = "Data ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bill_get",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Data ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.bill__id === undefined ||
			req.body.bill__id == "" ||
			req.body.bill__id === null
		) {
			validation = false;
			validationMsg = "Bill required";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		} else {
			bill__id = req.body.bill__id;
		}
	}

	if (validation) {
		bill__id = parseInt(bill__id);
		if (bill__id === undefined || isNaN(bill__id) || bill__id < 1) {
			validation = false;
			validationMsg = "Bill is not valid";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowbill = await db.getRow({
			table: "bill",
			filter: bill__id,
		});
		if (rowbill == false) {
			validation = false;
			validationMsg = "Bill is not found";
			validationData.push({
				field: "bill",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.billName === undefined ||
			req.body.billName == "" ||
			req.body.billName === null
		) {
			nameStr = `null`;
		} else {
			nameStr = `'${req.body.billName.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.amount === undefined ||
			req.body.amount == "" ||
			req.body.amount === null
		) {
			validation = false;
			validationMsg = "Amount required";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = req.body.amount;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount === undefined || isNaN(amount) || amount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = nf.dec(amount);
		}
	}

	if (validation) {
		if (
			req.body.renewAmount === undefined ||
			req.body.renewAmount == "" ||
			req.body.renewAmount === null
		) {
			validation = false;
			validationMsg = "Amount required";
			validationData.push({
				field: "renewAmount",
				msg: validationMsg,
			});
		} else {
			renewAmount = req.body.renewAmount;
		}
	}

	if (validation) {
		renewAmount = parseFloat(renewAmount);
		if (renewAmount === undefined || isNaN(renewAmount) || renewAmount < 0) {
			validation = false;
			validationMsg = "Amount is not valid";
			validationData.push({
				field: "renewAmount",
				msg: validationMsg,
			});
		} else {
			renewAmount = nf.dec(renewAmount);
		}
	}

	if (validation) {
		if (
			req.body.startDate === undefined ||
			req.body.startDate == "" ||
			req.body.startDate === null
		) {
			validation = false;
			validationMsg = "Start Date required";
			validationData.push({
				field: "startDate",
				msg: validationMsg,
			});
		} else {
			startDate = datexTime.format(
				new Date(req.body.startDate),
				"YYYY-MM-DD 00:00:00",
			);
			startDate2 = datexTime.format(new Date(req.body.startDate), "YYYY-MM-DD");
		}
	}

	if (validation) {
		if (
			req.body.duration === undefined ||
			req.body.duration == "" ||
			req.body.duration === null
		) {
			validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		} else {
			duration = req.body.duration;
		}
	}

	if (validation) {
		duration = parseInt(duration);
		if (duration === undefined || isNaN(duration)) {
			validation = false;
			validationMsg = "Service duration is not valid";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		minDuration = 1;
		if (duration < minDuration) {
			validation = false;
			validationMsg = `Service duration minimum ${minDuration} days`;
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.auto_renew === undefined ||
			req.body.auto_renew == "" ||
			req.body.auto_renew === null
		) {
			auto_renew = false;
			autoRenew = 0;
		} else {
			auto_renew = !!req.body.auto_renew;
			autoRenew = auto_renew ? 1 : 0;
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

	remindBefore = 2;
	xduration = duration - 1;
	rduration = xduration - remindBefore;
	endDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), xduration),
		"YYYY-MM-DD 23:59:59",
	);

	remindDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), rduration),
		"YYYY-MM-DD 23:59:59",
	);

	renewDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), duration),
		"YYYY-MM-DD 00:00:00",
	);

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE 
			\`bill_get\` 
		SET 
			\`bill__id\` = ${bill__id},
			\`name\` = ${nameStr},
			\`amount\` = ${amount},
			\`start_date\` = '${startDate}',
			\`end_date\` = '${endDate}',
			\`duration\` = ${duration},
			\`renew_date\` = '${renewDate}',
			\`auto_renew\` = ${autoRenew},
			\`renew_amount\` = ${renewAmount},
			\`remind_date\` = '${remindDate}',
			\`note\` = ${note},
			\`updated_date\` = '${cdate}'
		WHERE
			\`id\` = ${id};
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			resTmp = await billService.recalBill(bill__id);
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const Update = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.id === undefined ||
			req.body.id == "" ||
			req.body.id === null
		) {
			validation = false;
			validationMsg = "Data ID required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			id = req.body.id;
		}
	}

	if (validation) {
		id = parseInt(id);
		if (id === undefined || isNaN(id) || id < 1) {
			validation = false;
			validationMsg = "Data ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bill_pay",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Data ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			bank__id = req.body.bank__id;
		}
	}

	if (validation) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowBank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.amount === undefined ||
			req.body.amount == "" ||
			req.body.amount === null
		) {
			validation = false;
			validationMsg = "Add amount required";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		} else {
			amount = req.body.amount;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount === undefined || isNaN(amount)) {
			validation = false;
			validationMsg = "Add amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (amount < 0) {
			validation = false;
			validationMsg = "Add amount < 0";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.month_str === undefined ||
			req.body.month_str == "" ||
			req.body.month_str === null
		) {
			validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "month_str",
				msg: validationMsg,
			});
		} else {
			month_str = `'${req.body.month_str.trim().toString()}'`;
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		Update 
			bill_pay 
		SET 
			bank__id = ${bank__id},
			amount = ${amount},
			note = ${note},
			month_str = ${month_str},
			updated_date = '${cdate}'
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const xClose = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.body.id === undefined ||
			req.body.id == "" ||
			req.body.id === null
		) {
			validation = false;
			validationMsg = "Data ID required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			id = req.body.id;
		}
	}

	if (validation) {
		id = parseInt(id);
		if (id === undefined || isNaN(id) || id < 1) {
			validation = false;
			validationMsg = "Data ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		BillGetRow = await db.getRow({
			table: "bill_get",
			filter: id,
		});

		if (BillGetRow == false) {
			validation = false;
			validationMsg = "Data ID is not found";
			validationData.push({
				field: "id",
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE 
			\`bill_get\` 
		SET 
			\`is_closed\` = 1,
			\`updated_date\` = '${cdate}'
		WHERE 
			\`id\` = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const Close = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.params.id === undefined ||
			req.params.id == "" ||
			req.params.id === null
		) {
			validation = false;
			validationMsg = "ID required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			id = req.params.id;
		}
	}

	if (validation) {
		id = parseInt(id);
		if (id === undefined || isNaN(id) || id < 1) {
			validation = false;
			validationMsg = "ID not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bill_get",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Data not found";
			validationData.push({
				field: "id",
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE 
			\`bill_get\` 
		SET 
			\`is_closed\` = 1,
			\`auto_renew\` = 0,
			\`updated_date\` = '${cdate}'
		WHERE 
			\`id\` = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const Delete = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (
			req.params.id === undefined ||
			req.params.id == "" ||
			req.params.id === null
		) {
			validation = false;
			validationMsg = "ID required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			id = req.params.id;
		}
	}

	if (validation) {
		id = parseInt(id);
		if (id === undefined || isNaN(id) || id < 1) {
			validation = false;
			validationMsg = "ID not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bill_get",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Data not found";
			validationData.push({
				field: "id",
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

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE 
			\`bill_get\` 
		SET 
			\`is_delete\` = 1
		WHERE 
			\`id\` = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return true;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

module.exports = {
	List,
	Get,
	Gets,
	View,
	Insert,
	InsertT1,
	InsertT2,
	Close,
	Update,
	UpdateT1,
	UpdateT2,
	Delete,
};
