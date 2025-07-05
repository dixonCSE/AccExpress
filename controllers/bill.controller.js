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
				\`t1\`.\`name\` LIKE '%${search}%' 
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
				\`t1\`.\`name\` AS \`name\`,
				\`t1\`.\`phone\` AS \`phone\`,
				\`t1\`.\`duration\` AS \`duration\`,
				\`t1\`.\`is_fixed\` AS \`is_fixed\`,
				\`t1\`.\`des\` AS \`des\`,
				\`bill_type\`.\`key_code\` AS \`bill_type__key_code\`,
				\`bill_type\`.\`name\` AS \`bill_type__name\`,
				(
					SELECT 
						IFNULL(SUM(\`t2\`.\`amount\`), 0) AS \`total_paid\`
					FROM 
						\`payment_send\` AS \`t2\`
					WHERE 
						\`t2\`.\`vendor__id\` = \`t1\`.\`id\`
						AND 
						\`t2\`.\`vendor_type\` = 'bill'
						AND 
						\`t2\`.\`is_delete\` = 0
				) AS \`total_paid\`, 
				(
					SELECT 
						IFNULL(SUM(\`t3\`.\`amount\`), 0) AS \`total_payable\`
					FROM 
						\`bill_get\` AS \`t3\`
					WHERE 
						\`t3\`.\`bill__id\` = \`t1\`.\`id\`
						AND 
						\`t3\`.\`is_delete\` = 0
				) AS \`total_payable\`,
				(
					(
						SELECT 
							IFNULL(SUM(\`t3\`.\`amount\`), 0) AS \`total_payable\`
						FROM 
							\`bill_get\` AS \`t3\`
						WHERE 
							\`t3\`.\`bill__id\` = \`t1\`.\`id\`
							AND 
							\`t3\`.\`is_delete\` = 0
					) 
					- 
					(
						SELECT 
							IFNULL(SUM(\`t2\`.\`amount\`), 0) AS \`total_paid\`
						FROM 
							\`payment_send\` AS \`t2\`
						WHERE 
							\`t2\`.\`vendor__id\` = \`t1\`.\`id\`
							AND 
							\`t2\`.\`vendor_type\` = 'bill'
							AND 
							\`t2\`.\`is_delete\` = 0
					)
				) AS \`total_due\`
			FROM 
				\`bill\` AS \`t1\` 
				LEFT JOIN \`bill_type\` AS \`bill_type\` ON \`t1\`.\`bill_type__id\` = \`bill_type\`.\`id\`
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
				\`bill\` AS \`t1\` 
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

const yDataTable = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	filterMap = {
		id: `\`t1\`.\`id\``,
		duration: `\`t1\`.\`duration\``,
	};

	srcStr = "";
	if (search) {
		srcStr = `
			( 
				\`t1\`.\`name\` LIKE '%${search}%' 
				OR 
				\`t1\`.\`phone\` LIKE '%${search}%'
			) 
			AND 
		`;
	}

	sqlStr = "";
	if (filter) {
		filter = JSON.parse(filter);
		if (Object.keys(filter).length > 0) {
			sqlStr += ` `;
			i = 0;
			for (const [key, value] of Object.entries(filter)) {
				if (i == 0) {
				} else {
					sqlStr += ` AND `;
				}

				tmpType = typeof value;
				if (tmpType == "object" && Array.isArray(value)) {
					if (Array.isArray(value)) {
						sqlStr += ` \`${key}\` IN ( `;
						value.forEach((element, index) => {
							if (index == 0) {
								sqlStr += `'${element}' `;
							} else {
								sqlStr += `, '${element}' `;
							}
						});
						sqlStr += ` ) `;
					}
				} else {
					const con = key.split(" ");
					if (con[1] == undefined) {
						sqlStr += ` ${filterMap[key]} = '${value}' `;
					} else {
						sqlStr += ` ${filterMap[con[0]]} ${con[1]} '${value}' `;
					}
				}
				i++;
			}

			sqlStr += ` AND `;
		}
	}

	const rows = await db.query(
		`
			SELECT 
				\`t1\`.\`id\` AS \`id\`, 
				\`t1\`.\`name\` AS \`name\`,
				\`t1\`.\`phone\` AS \`phone\`,
				\`t1\`.\`duration\` AS \`duration\`,
				\`t1\`.\`is_fixed\` AS \`is_fixed\`,
				\`t1\`.\`des\` AS \`des\`,
				\`bill_type\`.\`key_code\` AS \`bill_type__key_code\`,
				\`bill_type\`.\`name\` AS \`bill_type__name\`,
				(
					SELECT 
						IFNULL(SUM(\`t2\`.\`amount\`), 0) AS \`total_paid\`
					FROM 
						\`payment_send\` AS \`t2\`
					WHERE 
						\`t2\`.\`vendor__id\` = \`t1\`.\`id\`
						AND 
						\`t2\`.\`vendor_type\` = 'bill'
						AND 
						\`t2\`.\`is_delete\` = 0
				) AS \`total_paid\`, 
				(
					SELECT 
						IFNULL(SUM(\`t3\`.\`amount\`), 0) AS \`total_payable\`
					FROM 
						\`bill_get\` AS \`t3\`
					WHERE 
						\`t3\`.\`bill__id\` = \`t1\`.\`id\`
						AND 
						\`t3\`.\`is_delete\` = 0
				) AS \`total_payable\`,
				(
					(
						SELECT 
							IFNULL(SUM(\`t3\`.\`amount\`), 0) AS \`total_payable\`
						FROM 
							\`bill_get\` AS \`t3\`
						WHERE 
							\`t3\`.\`bill__id\` = \`t1\`.\`id\`
							AND 
							\`t3\`.\`is_delete\` = 0
					) 
					- 
					(
						SELECT 
							IFNULL(SUM(\`t2\`.\`amount\`), 0) AS \`total_paid\`
						FROM 
							\`payment_send\` AS \`t2\`
						WHERE 
							\`t2\`.\`vendor__id\` = \`t1\`.\`id\`
							AND 
							\`t2\`.\`vendor_type\` = 'bill'
							AND 
							\`t2\`.\`is_delete\` = 0
					)
				) AS \`total_due\`
			FROM 
				\`bill\` AS \`t1\` 
				LEFT JOIN \`bill_type\` AS \`bill_type\` ON \`t1\`.\`bill_type__id\` = \`bill_type\`.\`id\`
			WHERE
				${sqlStr}
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
				\`bill\` AS \`t1\` 
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
			table: "bill",
			filter: req.params.id,
		});

		if (rows == false) {
			res.status(404).json({
				error: true,
				type: "error",
				logout: false,
				msg: "Data not found",
			});
			return true;
		} else {
			const total_bill = await db.colSum({
				table: "bill_get",
				col: "amount",
				filter: {
					bill__id: rows.id,
					is_delete: 0,
				},
			});

			const total_count = await db.rowCount({
				table: "bill_get",
				filter: {
					bill__id: rows.id,
					is_delete: 0,
				},
			});

			const total_paid = await db.colSum({
				table: "payment_send",
				col: "amount",
				filter: {
					vendor__id: rows.id,
					vendor_type: "bill",
					is_delete: 0,
				},
			});

			res.status(200).json({
				error: false,
				type: "success",
				logout: false,
				msg: "Access granted",
				data: {
					row: rows,
					total_bill: total_bill,
					total_count: total_count,
					total_paid: total_paid,
				},
			});
			return true;
		}
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
			table: "bill",
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
			table: "bill",
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
			req.body.name === undefined ||
			req.body.name == "" ||
			req.body.name === null
		) {
			validation = false;
			validationMsg = "name required";
			validationData.push({
				field: "name",
				msg: validationMsg,
			});
		} else {
			str_name = req.body.name.trim().toString();
		}
	}

	if (validation) {
		if (
			req.body.bill_type__id === undefined ||
			req.body.bill_type__id == "" ||
			req.body.bill_type__id === null
		) {
			validation = false;
			validationMsg = "Bill Type required";
			validationData.push({
				field: "bill_type",
				msg: validationMsg,
			});
		} else {
			bill_type__id = req.body.bill_type__id;
		}
	}

	if (validation) {
		bill_type__id = parseInt(bill_type__id);
		if (
			bill_type__id === undefined ||
			isNaN(bill_type__id) ||
			bill_type__id < 1
		) {
			validation = false;
			validationMsg = "Bill Type is not valid";
			validationData.push({
				field: "bill_type",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowBillType = await db.getRow({
			table: "bill_type",
			filter: bill_type__id,
		});

		if (rowBillType == false) {
			validation = false;
			validationMsg = "Bill Type is not found";
			validationData.push({
				field: "bill_type",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.phone === undefined ||
			req.body.phone == "" ||
			req.body.phone === null
		) {
			validation = false;
			validationMsg = "Phone required";
			validationData.push({
				field: "phone",
				msg: validationMsg,
			});
		} else {
			phone = req.body.phone.trim().toString();
		}
	}

	if (validation) {
		if (
			req.body.duration === undefined ||
			req.body.duration == "" ||
			req.body.duration === null
		) {
			/* validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			}); */
			duration = 0;
		} else {
			duration = parseInt(req.body.duration.trim());
		}
	}

	if (validation) {
		if (duration === undefined || isNaN(duration)) {
			validation = false;
			validationMsg = "duration is not valid";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.des === undefined ||
			req.body.des == "" ||
			req.body.des === null
		) {
			des = `null`;
		} else {
			des = `'${req.body.des.trim().toString()}'`;
		}
	}

	if (validation) {
		if (req.body.is_fixed === undefined || req.body.is_fixed == "") {
			is_fixed = false;
			isFixed = 0;
		} else {
			is_fixed = !!req.body.is_fixed;
			isFixed = is_fixed ? 1 : 0;
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
		INSERT INTO \`bill\` (
			\`name\`,
			\`bill_type__id\`,
			\`phone\`,
			\`duration\`,
			\`des\`,
			\`is_fixed\`,
			\`created_date\`,
			\`updated_date\`
		) 
		VALUES 
		(
			'${str_name}',
			${bill_type__id},
			'${phone}',
			${duration},
			${des},
			${isFixed},
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
			table: "bill",
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
			req.body.name === undefined ||
			req.body.name == "" ||
			req.body.name === null
		) {
			validation = false;
			validationMsg = "name required";
			validationData.push({
				field: "name",
				msg: validationMsg,
			});
		} else {
			str_name = req.body.name.trim().toString();
		}
	}

	if (validation) {
		if (
			req.body.bill_type__id === undefined ||
			req.body.bill_type__id == "" ||
			req.body.bill_type__id === null
		) {
			validation = false;
			validationMsg = "Bill Type required";
			validationData.push({
				field: "bill_type",
				msg: validationMsg,
			});
		} else {
			bill_type__id = req.body.bill_type__id;
		}
	}

	if (validation) {
		bill_type__id = parseInt(bill_type__id);
		if (
			bill_type__id === undefined ||
			isNaN(bill_type__id) ||
			bill_type__id < 1
		) {
			validation = false;
			validationMsg = "Bill Type is not valid";
			validationData.push({
				field: "bill_type",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowBillType = await db.getRow({
			table: "bill_type",
			filter: bill_type__id,
		});

		if (rowBillType == false) {
			validation = false;
			validationMsg = "Bill Type is not found";
			validationData.push({
				field: "bill_type",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.phone === undefined ||
			req.body.phone == "" ||
			req.body.phone === null
		) {
			validation = false;
			validationMsg = "phone required";
			validationData.push({
				field: "phone",
				msg: validationMsg,
			});
		} else {
			phone = req.body.phone.trim().toString();
		}
	}

	if (validation) {
		if (
			req.body.duration === undefined ||
			req.body.duration == "" ||
			req.body.duration === null
		) {
			/* validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			}); */
			duration = 0;
		} else {
			duration = parseInt(req.body.duration);
		}
	}

	if (validation) {
		if (duration === undefined || isNaN(duration)) {
			validation = false;
			validationMsg = "duration is not valid";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.des === undefined ||
			req.body.des == "" ||
			req.body.des === null
		) {
			des = `null`;
		} else {
			des = `'${req.body.des.trim().toString()}'`;
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
			\`bill\` 
		SET 
			\`name\` = '${str_name}',
			\`bill_type__id\` = ${bill_type__id},
			\`phone\` = '${phone}',
			\`duration\` = ${duration},
			\`des\` = ${des},
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
		if (req.params.id === undefined || req.params.id == "") {
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
			table: "bill",
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
			bill 
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
