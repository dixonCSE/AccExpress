require("dotenv").config();

const datexTime = require("date-and-time");
const db = require("../services/db.service.js");
const helper = require("../utils/dbHelper.util.js");
const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");
const sms = require("../services/sms.service");
const dueService = require("../services/due.service");
const advSrv = require("../services/adv.service");

const DTQuery = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	filterMap = {
		id: `\`t1\`.\`id\``,
		user__id: `\`t1\`.\`user__id\``,
		bank__id: `\`t1\`.\`bank__id\``,
	};

	searchStr = "";
	if (search) {
		searchStr = `
			( 
				\`t1\`.\`id\` LIKE '%${search}%' 
				OR 
				\`t1\`.\`amount\` LIKE '%${search}%'
				OR 
				\`user\`.\`company\` LIKE '%${search}%'
				OR 
				\`bank\`.\`name\` LIKE '%${search}%'
			) 
			AND  
		`;
	}

	filterStr = "";
	if (filter) {
		if (Object.keys(filter).length > 0) {
			filterStr += ` `;
			i = 0;
			for (const [key, value] of Object.entries(filter)) {
				if (i == 0) {
				} else {
					filterStr += ` AND `;
				}

				tmpType = typeof value;
				if (tmpType == "object" && Array.isArray(value)) {
					if (Array.isArray(value)) {
						filterStr += ` \`${key}\` IN ( `;
						value.forEach((element, index) => {
							if (index == 0) {
								filterStr += `'${element}' `;
							} else {
								filterStr += `, '${element}' `;
							}
						});
						filterStr += ` ) `;
					}
				} else {
					const con = key.split(" ");
					if (con[1] == undefined) {
						filterStr += ` ${filterMap[key]} = '${value}' `;
					} else {
						filterStr += ` ${filterMap[con[0]]} ${con[1]} '${value}' `;
					}
				}
				i++;
			}

			filterStr += ` AND `;
		}
	}

	const rows = await db.query(
		`
			SELECT 
				\`t1\`.\`id\` AS \`id\`, 
				\`t1\`.\`created_date\` AS \`created_date\`,
				\`t1\`.\`user__id\` AS \`user__id\`,
				\`t1\`.\`bank__id\` AS \`bank__id\`,
				\`t1\`.\`amount\` AS \`amount\`,
				\`t1\`.\`note\` AS \`note\`,
				\`t1\`.\`trxid\` AS \`trxid\`,
				\`t1\`.\`bank_ac\` AS \`bank_ac\`,
				\`t1\`.\`ac_holder\` AS \`ac_holder\`,
				\`t1\`.\`bank_branch\` AS \`bank_branch\`,
				\`t1\`.\`payment_date\` AS \`payment_date\`,
				\`user\`.\`company\` AS \`user__company\`,
				\`bank\`.\`name\` AS \`bank__name\`
			FROM 
				\`payment_return\` AS \`t1\` 
				LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`t1\`.\`user__id\`
				LEFT JOIN \`bank\` AS \`bank\` ON \`bank\`.\`id\` = \`t1\`.\`bank__id\`
			WHERE
				${filterStr}
				${searchStr}
				\`t1\`.\`is_delete\` = 0
			ORDER BY ${sort_col} ${sort_dir}
			LIMIT ${offset}, ${limit}
		`,
		[],
	);

	const count = await db.query(
		`
			SELECT 
				IFNULL(COUNT(\`t1\`.\`id\`), 0) AS \`cnt\`
			FROM 
				\`payment_return\` AS \`t1\` 
			WHERE
				${filterStr}
				${searchStr}
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

const Table = async (req, res, next) => {
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	if (
		req.body.filter === undefined ||
		req.body.filter == "" ||
		req.body.filter === null
	) {
		filter = false;
	} else {
		if (
			typeof req.body.filter === "object" &&
			Object.keys(req.body.filter).length > 0
		) {
			filter = req.body.filter;
		} else {
			filter = false;
		}
	}

	if (
		req.body.search === undefined ||
		req.body.search == "" ||
		req.body.search === null
	) {
		search = false;
	} else {
		search = req.body.search.trim().toString();
	}

	if (
		req.body.sort === undefined ||
		req.body.sort == "" ||
		req.body.sort === null
	) {
		sort = false;
	} else {
		sort = req.body.sort.trim().toString();
	}

	if (
		req.body.order === undefined ||
		req.body.order == "" ||
		req.body.order === null
	) {
		order = false;
	} else {
		order = req.body.order.trim().toString();
	}

	if (
		req.body.offset === undefined ||
		req.body.offset == "" ||
		req.body.offset === null
	) {
		offset = false;
	} else {
		offset = parseInt(req.body.offset);
	}

	if (offset === undefined || isNaN(offset)) {
		offset = false;
	}

	if (
		req.body.limit === undefined ||
		req.body.limit == "" ||
		req.body.limit === null
	) {
		limit = false;
	} else {
		limit = parseInt(req.body.limit);
	}

	if (limit === undefined || isNaN(limit) || limit < 1) {
		limit = false;
	}

	try {
		QryObj = {
			filter: filter,
			search: search,
			sort: sort,
			order: order,
			offset: offset,
			limit: limit,
		};
		const sqlRes = await DTQuery(QryObj);

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

const List = async (req, res, next) => {
	// console.log("req.body: ", req.query);
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	if (
		req.query.filter === undefined ||
		req.query.filter == "" ||
		req.query.filter === null
	) {
		filter = false;
	} else {
		if (
			typeof req.query.filter === "object" &&
			Object.keys(req.query.filter).length > 0
		) {
			filter = req.query.filter;
		} else {
			filter = false;
		}
	}

	if (
		req.query.search === undefined ||
		req.query.search == "" ||
		req.query.search === null
	) {
		search = false;
	} else {
		search = req.query.search.trim().toString();
	}

	if (
		req.query.sort === undefined ||
		req.query.sort == "" ||
		req.query.sort === null
	) {
		sort = false;
	} else {
		sort = req.query.sort.trim().toString();
	}

	if (
		req.query.order === undefined ||
		req.query.order == "" ||
		req.query.order === null
	) {
		order = false;
	} else {
		order = req.query.order.trim().toString();
	}

	if (
		req.query.offset === undefined ||
		req.query.offset == "" ||
		req.query.offset === null
	) {
		offset = false;
	} else {
		offset = parseInt(req.query.offset);
	}

	if (offset === undefined || isNaN(offset)) {
		offset = false;
	}

	if (
		req.query.limit === undefined ||
		req.query.limit == "" ||
		req.query.limit === null
	) {
		limit = false;
	} else {
		limit = parseInt(req.query.limit);
	}

	if (limit === undefined || isNaN(limit) || limit < 1) {
		limit = false;
	}

	try {
		QryObj = {
			filter: filter,
			search: search,
			sort: sort,
			order: order,
			offset: offset,
			limit: limit,
		};
		const sqlRes = await DTQuery(QryObj);

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
			table: "payment_return",
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
	try {
		const rows = await db.getRow({
			table: "payment_return",
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

const Gets = async (req, res, next) => {
	try {
		const sqlRes = await db.getRows({
			table: "payment_return",
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
		if (req.body.user__id == undefined || req.body.user__id == "") {
			validation = false;
			validationMsg = "Customer required";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		} else {
			user__id = req.body.user__id;
		}
	}

	if (validation) {
		user__id = parseInt(user__id);
		if (user__id == undefined || isNaN(user__id) || user__id < 1) {
			validation = false;
			validationMsg = "Customer is not valid";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowUser = await db.getRow({
			table: "user",
			filter: user__id,
		});

		if (rowUser == false) {
			validation = false;
			validationMsg = "Customer is not found";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		}
	}
	//////////
	if (validation) {
		if (req.body.bank__id == undefined || req.body.bank__id == "") {
			validation = false;
			validationMsg = "bank required";
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
		if (bank__id == undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowbank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowbank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}
	//////////
	if (validation) {
		if (req.body.payment === undefined || req.body.payment === "") {
			validation = false;
			validationMsg = "Payment required";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment == undefined || isNaN(payment) || payment < 0) {
			validation = false;
			validationMsg = "Payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
			if (payment <= 0.1) {
				t2 = false;
			}
		}
	}
	//////////
	if (validation) {
		if (req.body.paymentDate === undefined || req.body.paymentDate == "") {
			validation = false;
			validationMsg = "Payment Date required";
			validationData.push({
				field: "paymentDate",
				msg: validationMsg,
			});
		} else {
			paymentDate = datexTime.format(
				new Date(req.body.paymentDate),
				"YYYY-MM-DD HH:mm:ss",
			);
			paymentDate2 = datexTime.format(
				new Date(req.body.paymentDate),
				"YYYY-MM-DD",
			);
		}
	}
	//////////
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
	//////////
	if (validation) {
		if (
			req.body.bankAc === undefined ||
			req.body.bankAc == "" ||
			req.body.bankAc === null
		) {
			bankAc = `null`;
		} else {
			bankAc = `'${req.body.bankAc.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (
			req.body.acHolder === undefined ||
			req.body.acHolder == "" ||
			req.body.acHolder === null
		) {
			acHolder = `null`;
		} else {
			acHolder = `'${req.body.acHolder.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (
			req.body.bankBranch === undefined ||
			req.body.bankBranch == "" ||
			req.body.bankBranch === null
		) {
			bankBranch = `null`;
		} else {
			bankBranch = `'${req.body.bankBranch.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (req.body.note == undefined || req.body.note == "") {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	//////////
	if (validation) {
		if (req.body.isSms == undefined || req.body.isSms == "") {
			isSms = false;
		} else {
			isSms = !!req.body.isSms;
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
		INSERT INTO \`payment_return\` 
		(
			\`user__id\`,
			\`bank__id\`,
			\`wallet__id\`,
			\`amount\`,

			\`bank_ac\`,
			\`ac_holder\`,
			\`bank_branch\`,
			
			\`payment_date\`,
			\`trxid\`,

			\`note\`,
			\`created_date\`
		) 
		VALUES 
		(
			${user__id},
			${bank__id},
			11,
			${payment},

			${bankAc},
			${acHolder},
			${bankBranch},

			'${paymentDate}',
			${trxid},

			${note},
			'${cdate}'
		);
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);

		if (sqlres) {
			if (isSms) {
				let to = rowUser.phone;
				/*
				msg = `
					Dear ${rowUser.first_name},\n
					Refund Approved Successful.\n
					Return Amount: ${payment}\n
					Bank: ${rowbank.name}\n
					Refund A/C: ${bankAc}\n
					Please check your provided account.\n
					- PROVATi IT | 01873200200
				`;
				*/
				msg = `Dear ${rowUser.first_name},\nRefund Approved Successful.\nReturn Amount: ${payment}\nBank: ${rowbank.name}\nRefund A/C: ${bankAc}\nPlease check your provided account.\n- PROVATi IT | 01873200200`;
				smsRes = await sms.sendSms(to, msg);
			}

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
			table: "payment_return",
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
	//////////
	if (validation) {
		if (
			req.body.user__id === undefined ||
			req.body.user__id == "" ||
			req.body.user__id === null
		) {
			validation = false;
			validationMsg = "Customer required";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		} else {
			user__id = req.body.user__id;
		}
	}

	if (validation) {
		user__id = parseInt(user__id);
		if (user__id === undefined || isNaN(user__id) || user__id < 1) {
			validation = false;
			validationMsg = "Customer is not valid";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowUser = await db.getRow({
			table: "user",
			filter: user__id,
		});

		if (rowUser == false) {
			validation = false;
			validationMsg = "Customer Type is not found";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		}
	}
	//////////
	if (validation) {
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			validation = false;
			validationMsg = "bank required";
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
		rowbank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowbank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}
	//////////
	if (validation) {
		if (
			req.body.payment === undefined ||
			req.body.payment === "" ||
			req.body.payment === null
		) {
			validation = false;
			validationMsg = "Payment required";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment === undefined || isNaN(payment) || payment < 0) {
			validation = false;
			validationMsg = "Payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
			if (payment <= 0.1) {
				t2 = false;
			}
		}
	}
	//////////
	if (validation) {
		if (req.body.paymentDate == undefined || req.body.paymentDate == "") {
			validation = false;
			validationMsg = "Payment Date required";
			validationData.push({
				field: "paymentDate",
				msg: validationMsg,
			});
		} else {
			paymentDate = datexTime.format(
				new Date(req.body.paymentDate),
				"YYYY-MM-DD HH:mm:ss",
			);
			paymentDate2 = datexTime.format(
				new Date(req.body.paymentDate),
				"YYYY-MM-DD",
			);
		}
	}
	//////////
	if (validation) {
		if (
			req.body.bankAc === undefined ||
			req.body.bankAc == "" ||
			req.body.bankAc === null
		) {
			bankAc = `null`;
		} else {
			bankAc = `'${req.body.bankAc.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (
			req.body.acHolder === undefined ||
			req.body.acHolder == "" ||
			req.body.acHolder === null
		) {
			acHolder = `null`;
		} else {
			acHolder = `'${req.body.acHolder.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (
			req.body.bankBranch === undefined ||
			req.body.bankBranch == "" ||
			req.body.bankBranch === null
		) {
			bankBranch = `null`;
		} else {
			bankBranch = `'${req.body.bankBranch.trim().toString()}'`;
		}
	}
	//////////
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
	//////////
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
		UPDATE
			\`payment_return\` 
		SET 
			\`user__id\` = ${user__id},
			\`bank__id\` = ${bank__id},
			\`amount\` = ${payment},
			\`bank_ac\` = ${bankAc},
			\`ac_holder\` = ${acHolder},
			\`bank_branch\` = ${bankBranch},
			\`trxid\` = ${trxid},
			\`payment_date\` = '${paymentDate}',
			\`note\` = ${note},
			\`updated_date\` = '${cdate}'
		WHERE 
			\`id\` = ${id};
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
		if (req.params.id == undefined || req.params.id == "") {
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
		if (id == undefined || isNaN(id) || id < 1) {
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
			table: "payment_return",
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
			\`payment_return\` 
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
	Table,
	Get,
	Gets,
	View,
	Insert,
	Update,
	Delete,
};
