require("dotenv").config();

const datexTime = require("date-and-time");
const db = require("../services/db.service.js");
const helper = require("../utils/dbHelper.util.js");
const dateTime = require("../utils/cdate.util.js");

const DTQuery = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	// console.log("DTQuery: ", queryObj);

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	filterMap = {
		id: `\`t1\`.\`id\``,
		user__id: `\`t1\`.\`name\``,
		ptype: `\`t1\`.\`ptype\``,
		ptable: `\`t1\`.\`ptable\``,
		pt__id: `\`t1\`.\`pt__id\``,
	};

	searchStr = "";
	if (search) {
		searchStr = `
			( 
				\`t1\`.\`id\` LIKE '%${search}%' 
				OR 
				\`t1\`.\`name\` LIKE '%${search}%'
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
				\`t1\`.\`name\` AS \`name\`
			FROM 
				\`product_n_service\` AS \`t1\` 
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
				\`product_n_service\` AS \`t1\` 
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
			table: "product_n_service",
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
			table: "product_n_service",
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
			table: "product_n_service",
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
			sname = req.body.name.trim().toString();
		}
	}
	//////////
	if (validation) {
		if (
			req.body.ptype === undefined ||
			req.body.ptype == "" ||
			req.body.ptype === null
		) {
			validation = false;
			validationMsg = "ptype required";
			validationData.push({
				field: "ptype",
				msg: validationMsg,
			});
		} else {
			ptype = req.body.ptype.trim().toString();
		}
	}
	//////////
	if (validation) {
		if (
			req.body.ptable === undefined ||
			req.body.ptable == "" ||
			req.body.ptable === null
		) {
			ptable = `null`;
		} else {
			ptable = `'${req.body.ptable.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (
			req.body.pt__id === undefined ||
			req.body.pt__id == "" ||
			req.body.pt__id === null
		) {
			pt__id = `null`;
		} else {
			pt__id = `${parseInt(req.body.pt__id)}`;
		}
	}
	//////////

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
		INSERT INTO \`product_n_service\` 
		(
			\`name\`,
			\`ptype\`,
			\`ptable\`,
			\`pt__id\`,
			\`created_date\`
		) 
		VALUES 
		(
			'${sname}',
			'${ptype}',
			${ptable},
			${pt__id},
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
			table: "product_n_service",
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
			sname = req.body.name.trim().toString();
		}
	}
	//////////
	if (validation) {
		if (
			req.body.ptype === undefined ||
			req.body.ptype == "" ||
			req.body.ptype === null
		) {
			validation = false;
			validationMsg = "ptype required";
			validationData.push({
				field: "ptype",
				msg: validationMsg,
			});
		} else {
			ptype = req.body.ptype.trim().toString();
		}
	}
	//////////
	if (validation) {
		if (
			req.body.ptable === undefined ||
			req.body.ptable == "" ||
			req.body.ptable === null
		) {
			ptable = `null`;
		} else {
			ptable = `'${req.body.ptable.trim().toString()}'`;
		}
	}
	//////////
	if (validation) {
		if (
			req.body.pt__id === undefined ||
			req.body.pt__id == "" ||
			req.body.pt__id === null
		) {
			pt__id = `null`;
		} else {
			pt__id = `${parseInt(req.body.pt__id)}`;
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
			\`product_n_service\` 
		SET 
			\`name\` = ${sname},
			\`ptype\` = ${ptype},
			\`ptable\` = ${ptable},
			\`pt__id\` = ${pt__id},
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
			table: "product_n_service",
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
			\`product_n_service\` 
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
