require("dotenv").config();

const db = require("../services/db.service.js");
const helper = require("../utils/dbHelper.util.js");
const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");

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
				\`bank\`.\`name\` LIKE '%${search}%'
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
				\`t1\`.\`amount\` AS \`amount\`,
				\`t1\`.\`wallet__id\` AS \`wallet__id\`,
				\`t1\`.\`bank__id\` AS \`bank__id\`,
				\`t1\`.\`month_int\` AS \`month_int\`,
				\`t1\`.\`note\` AS \`note\`,
				\`t1\`.\`created_date\` AS \`created_date\`,

				\`bank\`.\`name\` AS \`bank__name\`,
				\`wallet\`.\`name\` AS \`wallet__name\`,
				\`bill\`.\`name\` AS \`bill__name\`,
				\`creator\`.\`first_name\` AS \`creator__first_name\`
			FROM 
				\`bill_pay\` AS \`t1\` 
				LEFT JOIN \`wallet\` AS \`wallet\` ON \`wallet\`.\`id\` = \`t1\`.\`wallet__id\`
				LEFT JOIN \`bank\` AS \`bank\` ON \`bank\`.\`id\` = \`t1\`.\`bank__id\`
				LEFT JOIN \`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
				LEFT JOIN \`user\` AS \`creator\` ON \`creator\`.\`id\` = \`t1\`.\`creator__id\`
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
				\`bill_pay\` AS \`t1\` 
				LEFT JOIN \`wallet\` AS \`wallet\` ON \`wallet\`.\`id\` = \`t1\`.\`wallet__id\`
				LEFT JOIN \`bank\` AS \`bank\` ON \`bank\`.\`id\` = \`t1\`.\`bank__id\`
				LEFT JOIN \`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
				LEFT JOIN \`user\` AS \`creator\` ON \`creator\`.\`id\` = \`t1\`.\`creator__id\`
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
			table: "bill_pay",
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
		table: "bill_pay",
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

const Insert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.bill__id == undefined || req.body.bill__id == "") {
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
		if (bill__id == undefined || isNaN(bill__id) || bill__id < 1) {
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
		if (req.body.bank__id == undefined || req.body.bank__id == "") {
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
		if (req.body.amount == undefined || req.body.amount == "") {
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
		if (amount == undefined || isNaN(amount)) {
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
		if (req.body.note == undefined || req.body.note == "") {
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

const Update = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.id == undefined || req.body.id == "") {
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
		if (id == undefined || isNaN(id) || id < 1) {
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
		if (req.body.bank__id == undefined || req.body.bank__id == "") {
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
		if (req.body.amount == undefined || req.body.amount == "") {
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
		if (amount == undefined || isNaN(amount)) {
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
		if (req.body.month_str == undefined || req.body.month_str == "") {
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
		if (req.body.note == undefined || req.body.note == "") {
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
			table: "bill_pay",
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
			\`bill_pay\` 
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
	View,
	Insert,
	Update,
	Delete,
};
