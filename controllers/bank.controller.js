require("dotenv").config();
const fs = require("fs");
const path = require("path");

const db = require("../services/db.service");
const helper = require("../utils/dbHelper.util");
const dateTime = require("../utils/cdate.util.js");

const bankDataTable = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	srcStr = "";
	if (search) {
		srcStr = `( name LIKE '%${search}%' ) AND `;
	}

	const rows = await db.query(
		`
			SELECT 
				id, 
				name, 
				image
			FROM 
				bank 
			WHERE
				${srcStr}
				is_delete = 0
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
				bank
			WHERE
				${srcStr}
				is_delete = 0
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

const bankList = async (req, res, next) => {
	try {
		const sqlRes = await bankDataTable(req.query);

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
			msg: "SQL QUERY error",
			err: err,
		});
		return true;
	}
};

const bankGet = async (req, res, next) => {
	try {
		const sqlRes = await db.getRow({
			table: "bank",
			filter: req.params.id,
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
		res.status(500).json({
			error: true,
			type: "error",
			msg: "error",
		});
		return true;
	}
};

const bankGets = async (req, res, next) => {
	try {
		const sqlRes = await db.getRows({
			table: "bank",
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

const bankView = async (req, res, next) => {
	// const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "Bank ID required";
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
			validationMsg = "Bank ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bank",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Bank ID is not found";
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
		return true;
	}
	//////////////////////////////////////////////// end validation ////////////////////////////////////////////////

	try {
		const sqlRes = await db.query(
			`
				SELECT 
					t1.id AS id, 
					t1.name AS name, 
					t1.image AS image, 
					t1.created_date AS created_date,
					(
						SELECT IFNULL(SUM(t2.payment), 0) FROM payment_receive AS t2 WHERE t2.bank__id = t1.id AND t2.is_delete = 0
					) AS total_payment_receive,
					(
						SELECT IFNULL(SUM(t3.amount), 0) FROM payment_return AS t3 WHERE t3.bank__id = t1.id AND t3.is_delete = 0
					) AS total_payment_return
				FROM 
					bank AS t1
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
			return true;
		}

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes[0] || false,
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

const bankInsert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (!req.file) {
		filePath = `/public/media/bank/default.png`;
	} else {
		filePath = `${req.file.destination}${req.file.filename}`.substring(1);
	}

	if (validation) {
		if (req.body.name == undefined || req.body.name == "") {
			validation = false;
			validationMsg = "Bank name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			name_str = req.body.name.trim().toString();
		}
	}

	if (validation) {
		resultTmp = await db.query(
			`
				SELECT
					IFNULL(COUNT(*), 0) AS count
				FROM 
					bank
				WHERE 
					name = ? 
				LIMIT 0, 1
			`,
			[name_str],
		);

		if (resultTmp && parseInt(resultTmp[0]["count"]) > 0) {
			validation = false;
			validationMsg = "Bank name already exist";
			validationData.push({
				field: "name",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.des == undefined || req.body.des == "") {
			des = `null`;
		} else {
			des = `'${req.body.des.trim().toString()}'`;
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
		INSERT INTO bank (
			name,
			key_code,
			image,
			des,

			created_date,
			updated_date
			) VALUES (
				'${name_str}',
				'${name_str.toLowerCase().replaceAll(" ", "_")}',
				'${filePath}',
				${des},

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

const bankUpdate = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.id == undefined || req.body.id == "") {
			validation = false;
			validationMsg = "Bank ID required";
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
			validationMsg = "Bank ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bank",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Bank ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			filePath = row.image;
			if (req.file) {
				filePath = `/public/media/bank/${req.file.filename}`;
			}
		}
	}

	if (validation) {
		if (req.body.name == undefined || req.body.name == "") {
			validation = false;
			validationMsg = "Bank name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			name_str = req.body.name.trim().toString();
		}
	}

	if (validation) {
		if (name_str == row.name) {
		} else {
			resultTmp = await db.query(
				`
					SELECT
						IFNULL(COUNT(*), 0) AS count
					FROM 
						bank
					WHERE 
						name = ? 
					LIMIT 0, 1
				`,
				[name_str],
			);

			if (resultTmp && parseInt(resultTmp[0]["count"]) > 0) {
				validation = false;
				validationMsg = "Bank name already exist";
				validationData.push({
					field: "name",
					msg: validationMsg,
				});
			}
		}
	}

	if (validation) {
		if (req.body.des == undefined || req.body.des == "") {
			des = `null`;
		} else {
			des = `'${req.body.des.trim().toString()}'`;
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
		Update 
			bank 
		SET 
			name = '${name_str}',
			key_code = '${name_str.toLowerCase().replaceAll(" ", "_")}',
			image = '${filePath}',
			des = ${des},
			updated_date = '${cdate}'
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			/* if (req.file) {
				if (
					typeof row.image !== "undefined" &&
					row.image.match("default.png") != null
				) {
				} else {
					const _filePath = path.join(__dirname, "../", row.image);
					fs.unlink(_filePath, (err) => {
						if (err) {
							console.error(`Error deleting file: ${err}`);
						} else {
							console.log("204");
						}
					});
				}
			} */

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

const bankDelete = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "Bank ID required";
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
		if (id == undefined || isNaN(id) || id < 0) {
			validation = false;
			validationMsg = "Bank ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "bank",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Bank ID is not found";
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
			bank 
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
			/* 
			if (req.file) {
				if ( typeof row.image !== 'undefined' && row.image.match('default.png') != null )  {} else {
					const _filePath = path.join(__dirname, "../", row.image);
					fs.unlink(_filePath, (err) => {
						if (err) {
							console.error(`Error deleting file: ${err}`);
						} else {
							console.log("204");
						}
					});
				}
			}
			*/
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
	bankList,
	bankView,
	bankGet,
	bankGets,
	bankInsert,
	bankUpdate,
	bankDelete,
};
