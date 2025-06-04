require("dotenv").config();
const db = require("../services/db.service.js");
const helper = require("../utils/dbHelper.util.js");
const dateTime = require("../utils/cdate.util.js");

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
				\`employee\`.\`user_name\` LIKE '%${search}%' 
				OR 
				\`employee\`.\`phone\` LIKE '%${search}%'
			) 
			AND 
		`;
	}

	const rows = await db.query(
		`
			SELECT 
				\`t1\`.\`id\` AS \`id\`, 
				\`t1\`.\`employee__id\` AS \`employee__id\`,
				\`t1\`.\`wallet__id\` AS \`wallet__id\`, 
				\`t1\`.\`bank__id\` AS \`bank__id\`, 
				\`t1\`.\`amount\` AS \`amount\`, 
				\`t1\`.\`note\` AS \`note\`, 
				\`t1\`.\`salary_month\` AS \`salary_month\`, 
				\`t1\`.\`issuer__id\` AS \`issuer__id\`,
				\`t1\`.\`issue_date\` AS \`issue_date\`,
				\`t1\`.\`created_date\` AS \`created_date\`,

				\`employee\`.\`user_name\` AS \`employee__user_name\`, 
				\`employee\`.\`first_name\` AS \`employee__first_name\`, 
				\`employee\`.\`image\` AS \`employee__image\`, 
				\`employee\`.\`phone\` AS \`employee__phone\`,
				\`issuer\`.\`user_name\` AS \`issuer__user_name\`, 
				\`bank\`.\`name\` AS \`bank__name\`, 
				\`bank\`.\`image\` AS \`bank__image\`, 
				\`wallet\`.\`name\` AS \`wallet__name\`
			FROM 
				\`salary\` AS \`t1\` 
				LEFT JOIN \`user\` AS \`employee\` ON \`employee\`.\`id\` = \`t1\`.\`employee__id\` 
				LEFT JOIN \`user\` AS \`issuer\` ON \`issuer\`.\`id\` = \`t1\`.\`issuer__id\` 
				LEFT JOIN \`bank\` AS \`bank\` ON \`bank\`.\`id\` = \`t1\`.\`bank__id\` 
				LEFT JOIN \`wallet\` AS \`wallet\` ON \`wallet\`.\`id\` = \`t1\`.\`wallet__id\`
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
				\`salary\` AS \`t1\` 
				LEFT JOIN \`user\` AS \`employee\` ON \`employee\`.\`id\` = \`t1\`.\`employee__id\` 
				LEFT JOIN \`user\` AS \`issuer\` ON \`issuer\`.\`id\` = \`t1\`.\`issuer__id\` 
				LEFT JOIN \`bank\` AS \`bank\` ON \`bank\`.\`id\` = \`t1\`.\`bank__id\` 
				LEFT JOIN \`wallet\` AS \`wallet\` ON \`wallet\`.\`id\` = \`t1\`.\`wallet__id\`
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
		return false;
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return false;
	}
};

const View = async (req, res, next) => {
	try {
		const rows = await db.getRow({
			table: "salary",
			filter: req.params.id,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: rows,
		});
		return false;
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
			table: "salary",
			filter: req.params.id,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: rows,
		});
		return false;
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

const Insert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.employee__id == undefined || req.body.employee__id == "") {
			validation = false;
			validationMsg = "Employee required";
			validationData.push({
				field: "employee",
				msg: validationMsg,
			});
		} else {
			employee__id = req.body.employee__id;
		}
	}

	if (validation) {
		employee__id = parseInt(employee__id);
		if (employee__id == undefined || isNaN(employee__id) || employee__id < 1) {
			validation = false;
			validationMsg = "employee is not valid";
			validationData.push({
				field: "employee",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		employeeRow = await db.getRow({
			table: "user",
			filter: employee__id,
		});

		if (employeeRow == false) {
			validation = false;
			validationMsg = "employee is not found";
			validationData.push({
				field: "user",
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
		if (req.body.payment == undefined || req.body.payment == "") {
			validation = false;
			validationMsg = "Salary payment required";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			amount = req.body.payment;
		}
	}

	if (validation) {
		amount = parseFloat(amount);
		if (amount == undefined || isNaN(amount)) {
			validation = false;
			validationMsg = "Salary payment is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (amount < 0) {
			validation = false;
			validationMsg = "Salary payment < 0";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.salary_month == undefined || req.body.salary_month == "") {
			salary_month = `null`;
		} else {
			salary_month = `'${req.body.salary_month.trim().toString()}'`;
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
			\`salary\` (
				\`employee__id\`,
				\`bank__id\`,
				\`wallet__id\`,
				\`amount\`,

				\`issuer__id\`,
				\`issue_date\`,
				\`salary_month\`,

				\`note\`,
				\`created_date\`,
				\`updated_date\`
			) 
			VALUES 
			(
				${employee__id},
				${bank__id},
				11,
				${amount},

				${req.user.id},
				'${cdate}',
				${salary_month},

				${note},
				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	sqltmp = `
		INSERT INTO 
			\`debit_rec\` (
				\`bank__id\`,
				\`wallet__id\`,
				\`amount\`,

				\`creator__id\`,
				\`table_name\`,
				\`row__id\`,

				\`note\`,
				\`created_date\`,
				\`updated_date\`
			) 
			VALUES 
			(
				${bank__id},
				11,
				${amount},

				${req.user.id},
				'salary',
				@liid,

				${note},
				'${cdate}',
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
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return false;
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
			validationMsg = "Salary ID required";
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
			validationMsg = "Salary ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "salary",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Payment Receive ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.employee__id == undefined || req.body.employee__id == "") {
			validation = false;
			validationMsg = "Employee required";
			validationData.push({
				field: "employee",
				msg: validationMsg,
			});
		} else {
			employee__id = req.body.employee__id;
		}
	}

	if (validation) {
		employee__id = parseInt(employee__id);
		if (employee__id == undefined || isNaN(employee__id) || employee__id < 1) {
			validation = false;
			validationMsg = "employee is not valid";
			validationData.push({
				field: "employee",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		employeeRow = await db.getRow({
			table: "user",
			filter: employee__id,
		});

		if (employeeRow == false) {
			validation = false;
			validationMsg = "employee is not found";
			validationData.push({
				field: "user",
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
			validationMsg = "Salary payment required";
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
			validationMsg = "Salary payment is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (amount < 0) {
			validation = false;
			validationMsg = "Salary payment < 0";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.salary_month == undefined || req.body.salary_month == "") {
			salary_month = `null`;
		} else {
			salary_month = `'${req.body.salary_month.trim().toString()}'`;
		}
	}

	if (validation) {
		if (req.body.issue_date == undefined || req.body.issue_date == "") {
			issue_date = `null`;
		} else {
			issue_date = `'${req.body.issue_date.trim().toString()}'`;
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
			salary
		SET
			employee__id = ${employee__id},
			bank__id = ${bank__id},
			amount = ${amount},
			salary_month = ${salary_month},
			issue_date = '${issue_date}',
			note = ${note},
			updated_date = '${cdate}'
		WHERE
			id = ${row.id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		Update
			debit_rec
		SET
			amount = ${amount},
			note = ${note},
			bank__id = ${bank__id},
			updated_date = '${cdate}'
		WHERE
			table_name = 'salary'
			AND
			row__id = ${row.id}
			AND
			is_delete = 0
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
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return false;
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
			table: "salary",
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
			salary 
		SET 
			is_delete = 1
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		Update
			debit_rec
		SET
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE
			table_name = 'salary'
			AND
			row__id = ${id}
			AND
			is_delete = 0
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
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return false;
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
