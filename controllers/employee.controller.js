require("dotenv").config();
const fs = require("fs");
const path = require("path");

const db = require("../services/db.service");
const helper = require("../utils/dbHelper.util");
const dateTime = require("../utils/cdate.util.js");
const CryptoJS = require("crypto-js");

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
				\`t1\`.\`user_name\` LIKE '%${search}%' 
				OR 
				\`t1\`.\`phone\` LIKE '%${search}%'
			) 
			AND 
		`;
	}

	const rows = await db.query(
		`
			SELECT 
				\`t1\`.\`id\` AS \`id\`, 
				\`t1\`.\`login_id\` AS \`login_id\`,
				\`t1\`.\`phone\` AS \`phone\`,
				\`t1\`.\`email\` AS \`email\`,
				\`t1\`.\`image\` AS \`image\`,
				\`t1\`.\`user_name\` AS \`user_name\`,
				\`t1\`.\`first_name\` AS \`first_name\`,
				\`t1\`.\`created_date\` AS \`created_date\`
			FROM 
				\`user\` AS \`t1\` 
				INNER JOIN \`user_role\` AS \`user_role\` ON \`user_role\`.\`id\` = \`t1\`.\`user_role__id\`
			WHERE
				${srcStr}
				\`t1\`.\`is_delete\` = 0
				AND 
				\`user_role\`.\`key_code\` = 'employee'
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
				\`user\` AS \`t1\` 
				INNER JOIN \`user_role\` AS \`user_role\` ON \`user_role\`.\`id\` = \`t1\`.\`user_role__id\`
			WHERE
				${srcStr}
				\`t1\`.\`is_delete\` = 0
				AND 
				\`user_role\`.\`key_code\` = 'employee'
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
			table: "user",
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
			table: "user",
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
		const rows = await db.getRows({
			table: "user",
			filter: {
				is_delete: 0,
				user_role__id: 11,
			},
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

const Insert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (!req.file) {
		filePath = `/public/media/user/default.png`;
	} else {
		filePath = `${req.file.destination}${req.file.filename}`.substring(1);
	}

	if (validation) {
		if (req.body.user_name == undefined || req.body.user_name == "") {
			validation = false;
			validationMsg = "User name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			user_name = req.body.user_name;
		}
	}

	if (validation) {
		if (req.body.first_name == undefined || req.body.first_name == "") {
			validation = false;
			validationMsg = "Full name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			first_name = req.body.first_name.trim().toString();
		}
	}

	if (validation) {
		resultTmp = await db.query(
			`
				SELECT
					IFNULL(COUNT(*), 0) AS count
				FROM 
					user
				WHERE 
					login_id = ? 
				LIMIT 0, 1
			`,
			[user_name],
		);

		if (resultTmp && parseInt(resultTmp[0]["count"]) > 0) {
			validation = false;
			validationMsg = "user name is not available";
			validationData.push({
				field: "user_name",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.email == undefined || req.body.email == "") {
			email = `null`;
		} else {
			email = `'${req.body.email.toString()}'`;
		}
	}

	if (validation) {
		if (req.body.phone == undefined || req.body.phone == "") {
			phone = `null`;
		} else {
			phone = `'${req.body.phone.toString()}'`;
		}
	}

	if (validation) {
		if (req.body.company == undefined || req.body.company == "") {
			company = `null`;
		} else {
			company = `'${req.body.company.toString()}'`;
		}
	}

	if (validation) {
		if (req.body.password == undefined || req.body.password == "") {
			validation = false;
			validationMsg = "User password required";
			validationData.push({
				field: "password",
				msg: validationMsg,
			});
		} else {
			password = CryptoJS.AES.encrypt(
				req.body.password,
				process.env.SECURITY_PRIVATE_KEY,
			).toString();
		}
	}

	if (validation) {
		if (
			req.body.confirm_password == undefined ||
			req.body.confirm_password == ""
		) {
			validation = false;
			validationMsg = "User confirm password required";
			validationData.push({
				field: "confirm_password",
				msg: validationMsg,
			});
		} else {
			confirm_password = req.body.confirm_password.toString();
		}
	}

	if (validation) {
		if (req.body.password.toString() !== confirm_password) {
			validation = false;
			validationMsg = "User confirm password not match";
			validationData.push({
				field: "confirm_password",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowRole = await db.getRow({
			table: "user_role",
			filter: {
				key_code: "employee",
				is_delete: 0,
			},
		});
		if (rowRole == false) {
			validation = false;
			validationMsg = "user role error";
			validationData.push({
				field: "user_name",
				msg: validationMsg,
			});
		}
	}

	if (validation == false) {
		/* if (req.file) {
			const _filePath = path.join(__dirname, "../", filePath);
			fs.unlink(_filePath, (err) => {
				if (err) {
					console.error(`Error deleting file: ${err}`);
				} else {
					console.log("204");
				}
			});
		} */

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
		INSERT INTO user (
			login_id,
			user_name,
			first_name,
			image,
			email,
			phone,
			company,

			password,

			user_role__id,
			created_date,
			updated_date
			) VALUES (
			'${user_name}',
			'${user_name}',
			'${first_name}',
			'${filePath}',
			${email},
			${phone},
			${company},

			'${password}',

			${rowRole.id},
			'${cdate}',
			'${cdate}'
		);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
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
			table: "user",
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
			user 
		SET 
			is_delete = 1
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

module.exports = {
	List,
	Get,
	Gets,
	View,
	Insert,
	Update,
	Delete,
};
