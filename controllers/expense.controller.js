require("dotenv").config();
const db = require("../services/db.service");
const helper = require("../utils/dbHelper.util");
const dateTime = require("../utils/cdate.util.js");

const dataTable = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	srcStr = "";
	if (search) {
		srcStr = `( 
				t1.amount = ${search}
				OR 
				t1.name LIKE '%${search}%' 
				OR 
				t2.name LIKE '%${search}%' 
			) AND `;
	}

	const rows = await db.query(
		`
			SELECT 
				t1.id AS id, 
				t1.name AS name, 
				t1.bank__id AS bank__id, 
				t1.wallet__id AS wallet__id, 
				t1.expense_type__id AS expense_type__id, 
				t1.type_name AS type_name, 
				t1.amount AS amount, 
				t1.created_date AS created_date,

				t2.name AS bank__name, 
				t2.image AS bank__image, 
				t3.name AS wallet__name
			FROM 
				expense AS t1
				LEFT JOIN bank AS t2 ON t2.id = t1.bank__id 
				LEFT JOIN wallet AS t3 ON t3.id = t1.wallet__id
			WHERE
				${srcStr}
				t1.is_delete = 0
			ORDER BY ${sort_col} ${sort_dir}
			LIMIT ${offset},${limit}
		`,
		[],
	);

	const count = await db.query(
		`
			SELECT 
				IFNULL(COUNT(*), 0) AS cnt
			FROM 
				expense AS t1
				LEFT JOIN bank AS t2 ON t2.id = t1.bank__id 
				LEFT JOIN wallet AS t3 ON t3.id = t1.wallet__id
			WHERE
				${srcStr}
				t1.is_delete = 0
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
		const sqlRes = await dataTable(req.query);

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
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
};

const Get = async (req, res, next) => {
	try {
		const sqlRes = await db.getRow({
			table: "expense",
			filter: req.params.id,
		});

		if (sqlRes == false) {
			res.status(404).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return false;
		}

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes,
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

const View = async (req, res, next) => {
	// const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "Expense ID required";
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
		if (id == undefined || isNaN(id) || id > 0) {
			validation = false;
			validationMsg = "expense ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "expense",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "expense ID is not found";
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

	try {
		const sqlRes = await db.query(
			`
				SELECT 
					t1.id AS id, 
					t1.name AS name, 
					t1.bank__id AS bank__id, 
					t1.wallet__id AS wallet__id, 
					t1.expense_type__id AS expense_type__id, 
					t1.amount AS amount, 
					t1.des AS des, 
					t1.created_date AS created_date,

					t2.name AS bank__name, 
					t3.name AS wallet__name
				FROM 
					expense AS t1
					LEFT JOIN bank AS t2 ON t2.id = t1.bank__id 
					LEFT JOIN wallet AS t3 ON t3.id = t1.wallet__id
				WHERE
					id = ${id} 
					AND
					is_delete = 0
				LIMIT 0, 1
			`,
			[],
		);

		if (sqlRes == false) {
			res.status(404).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return false;
		}

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes[0] || false,
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
		if (req.body.name == undefined || req.body.name == "") {
			validation = false;
			validationMsg = "Expense name required";
			validationData.push({
				field: "name",
				msg: validationMsg,
			});
		} else {
			sname = req.body.name.trim().toString();
		}
	}

	if (validation) {
		if (req.body.type_name == undefined || req.body.type_name == "") {
			validation = false;
			validationMsg = "Type name required";
			validationData.push({
				field: "type_name",
				msg: validationMsg,
			});
		} else {
			type_name = req.body.type_name.trim().toString();
		}
	}

	if (validation) {
		if (req.body.bank__id == undefined || req.body.bank__id == "") {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank__id",
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
				field: "bank__id",
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
				field: "bank__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.payment == undefined || req.body.payment == "") {
			validation = false;
			validationMsg = "Expense payment required";
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
			validationMsg = "Expense payment is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (amount < 0) {
			validation = false;
			validationMsg = "Expense payment < 0";
			validationData.push({
				field: "amount",
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
			INSERT INTO expense (
				name,
				type_name,

				bank__id,
				wallet__id,
				amount,

				created_date,
				updated_date
				) VALUES (
					'${sname}',
					'${type_name}',
	
					${bank__id},
					11,
					${amount},
	
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
			validationMsg = "Expense ID required";
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
			validationMsg = "Expense ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "expense",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Expense ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.name == undefined || req.body.name == "") {
			validation = false;
			validationMsg = "Expense name required";
			validationData.push({
				field: "name",
				msg: validationMsg,
			});
		} else {
			sname = req.body.name.trim().toString();
		}
	}

	if (validation) {
		if (req.body.type_name == undefined || req.body.type_name == "") {
			validation = false;
			validationMsg = "Expense description required";
			validationData.push({
				field: "type_name",
				msg: validationMsg,
			});
		} else {
			type_name = req.body.type_name.trim().toString();
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
			validationMsg = "Expense amount required";
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
			validationMsg = "Expense amount is not valid";
			validationData.push({
				field: "amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (amount < 0) {
			validation = false;
			validationMsg = "Expense amount < 0";
			validationData.push({
				field: "amount",
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
		Update 
			expense 
		SET 
			name = '${sname}',
			type_name = '${type_name}',
			bank__id = ${bank__id},
			amount = ${amount},
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
			validationMsg = "Expense ID required";
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
		if (id == undefined || isNaN(id) || id <= 0) {
			validation = false;
			validationMsg = "Expense ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "expense",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Expense ID is not found";
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
		Update 
			expense 
		SET 
			is_delete = 1,
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
	View,
	Get,
	Insert,
	Update,
	Delete,
};
