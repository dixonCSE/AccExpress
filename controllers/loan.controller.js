require("dotenv").config();

const db = require("../services/db.service");
const helper = require("../utils/dbHelper.util");
const dateTime = require("../utils/cdate.util.js");

const loanDataTable = async (queryObj = false) => {
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
				t2.user_name LIKE '%${search}%' 
				OR 
				t2.phone LIKE '%${search}%' 
				OR 
				t3.name LIKE '%${search}%'
			) 
			AND 
		`;
	}

	const rows = await db.query(
		`
			SELECT 
				t1.id AS id, 
				t1.user__id AS user__id, 
				t1.wallet__id AS wallet__id, 
				t1.bank__id AS bank__id, 
				t1.amount AS amount, 
				t1.interest AS interest, 
				t1.is_open AS is_open, 
				t1.created_date AS created_date,

				t2.user_name AS user__user_name, 
				t2.image AS user__image, 
				t2.phone AS user__phone, 
				t3.name AS bank__name, 
				t4.name AS wallet__name
			FROM 
				loan AS t1
				LEFT JOIN user AS t2 ON t2.id = t1.user__id 
				LEFT JOIN bank AS t3 ON t3.id = t1.bank__id 
				LEFT JOIN wallet AS t4 ON t4.id = t1.wallet__id
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
				IFNULL(COUNT(t1.*), 0) AS cnt
			FROM 
				loan AS t1
				LEFT JOIN user AS t2 ON t2.id = t1.user__id 
				LEFT JOIN bank AS t3 ON t3.id = t1.bank__id 
				LEFT JOIN wallet AS t4 ON t4.id = t1.wallet__id
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

const loanList = async (req, res, next) => {
	try {
		const sqlRes = await loanDataTable(req.query);

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

const loanGet = async (req, res, next) => {
	try {
		const sqlRes = await db.getRow({
			table: "loan",
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

const loanView = async (req, res, next) => {
	// const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "Loan ID required";
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
			validationMsg = "Loan ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "loan",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Loan ID is not found";
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
					t1.user__id AS user__id, 
					t1.wallet__id AS wallet__id, 
					t1.bank__id AS bank__id, 
					t1.amount AS amount, 
					t1.interest AS interest, 
					t1.is_open AS is_open, 
					t1.created_date AS created_date,

					t2.user_name AS user__user_name, 
					t2.image AS user__image, 
					t2.phone AS user__phone, 
					t3.name AS bank__name, 
					t4.name AS wallet__name
				FROM 
					loan AS t1
					LEFT JOIN user AS t2 ON t2.id = t1.user__id 
					LEFT JOIN bank AS t3 ON t3.id = t1.bank__id 
					LEFT JOIN wallet AS t4 ON t4.id = t1.wallet__id
				WHERE
					t1.id = ${id} 
					AND
					t1.is_delete = 0
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

const loanInsert = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 9999,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
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

const loanUpdate = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
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

const loanDelete = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "Loan ID required";
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
			validationMsg = "Loan ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "loan",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Loan ID is not found";
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
			loan 
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
	loanList,
	loanGet,
	loanView,
	loanInsert,
	loanUpdate,
	loanDelete,
};
