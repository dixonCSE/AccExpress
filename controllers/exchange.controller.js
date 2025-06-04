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
				\`t1\`.\`send_amount\` LIKE '%${search}%' 
				OR 
				\`send_bank\`.\`name\` LIKE '%${search}%'
				OR 
				\`receive_bank\`.\`name\` LIKE '%${search}%'
			) 
			AND 
		`;
	}

	const rows = await db.query(
		`
			SELECT 
				\`t1\`.\`id\` AS \`id\`, 
				\`t1\`.\`send_amount\` AS \`send_amount\`,
				\`t1\`.\`send_wallet__id\` AS \`send_wallet__id\`,
				\`t1\`.\`send_bank__id\` AS \`send_bank__id\`,
				\`t1\`.\`charge\` AS \`charge\`,
				\`t1\`.\`receive_amount\` AS \`receive_amount\`,
				\`t1\`.\`receive_wallet__id\` AS \`receive_wallet__id\`,
				\`t1\`.\`receive_bank__id\` AS \`receive_bank__id\`,
				\`t1\`.\`note\` AS \`note\`,
				\`t1\`.\`created_date\` AS \`created_date\`,

				\`send_bank\`.\`name\` AS \`send_bank__name\`,
				\`receive_bank\`.\`name\` AS \`receive_bank__name\`
			FROM 
				\`user_bank_exchange\` AS \`t1\` 
				LEFT JOIN \`bank\` AS \`send_bank\` ON \`send_bank\`.\`id\` = \`t1\`.\`send_bank__id\`
				LEFT JOIN \`bank\` AS \`receive_bank\` ON \`receive_bank\`.\`id\` = \`t1\`.\`receive_bank__id\`
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
				\`user_bank_exchange\` AS \`t1\` 
				LEFT JOIN \`bank\` AS \`send_bank\` ON \`send_bank\`.\`id\` = \`t1\`.\`send_bank__id\`
				LEFT JOIN \`bank\` AS \`receive_bank\` ON \`receive_bank\`.\`id\` = \`t1\`.\`receive_bank__id\`
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
			table: "user_bank_exchange",
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
			table: "user_bank_exchange",
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

const Insert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.send_bank__id == undefined || req.body.send_bank__id == "") {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			send_bank__id = req.body.send_bank__id;
		}
	}

	if (validation) {
		send_bank__id = parseInt(send_bank__id);
		if (
			send_bank__id == undefined ||
			isNaN(send_bank__id) ||
			send_bank__id < 1
		) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowSendBank = await db.getRow({
			table: "bank",
			filter: send_bank__id,
		});

		if (rowSendBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "send_bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.receive_bank__id == undefined ||
			req.body.receive_bank__id == ""
		) {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			receive_bank__id = req.body.receive_bank__id;
		}
	}

	if (validation) {
		receive_bank__id = parseInt(receive_bank__id);
		if (
			receive_bank__id == undefined ||
			isNaN(receive_bank__id) ||
			receive_bank__id < 1
		) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowReceiveBank = await db.getRow({
			table: "bank",
			filter: receive_bank__id,
		});

		if (rowReceiveBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "send_bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.send_amount == undefined || req.body.send_amount == "") {
			validation = false;
			validationMsg = "Send amount required";
			validationData.push({
				field: "send_amount",
				msg: validationMsg,
			});
		} else {
			send_amount = req.body.send_amount;
		}
	}

	if (validation) {
		send_amount = parseFloat(send_amount);
		if (send_amount == undefined || isNaN(send_amount)) {
			validation = false;
			validationMsg = "Send amount is not valid";
			validationData.push({
				field: "send_amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (send_amount < 0) {
			validation = false;
			validationMsg = "Send amount < 0";
			validationData.push({
				field: "send_amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.charge == undefined || req.body.charge == "") {
			validation = false;
			validationMsg = "Charge amount required";
			validationData.push({
				field: "charge",
				msg: validationMsg,
			});
		} else {
			charge = req.body.charge;
		}
	}

	if (validation) {
		charge = parseFloat(charge);
		if (charge == undefined || isNaN(charge)) {
			validation = false;
			validationMsg = "Charge is not valid";
			validationData.push({
				field: "charge",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (charge < 0) {
			validation = false;
			validationMsg = "Charge amount < 0";
			validationData.push({
				field: "charge",
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
	receive_amount = send_amount - charge;
	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		INSERT INTO \`user_bank_exchange\` (
			\`creator__id\`,

			\`send_bank__id\`,
			\`send_wallet__id\`,
			\`send_amount\`,

			\`charge\`,

			\`receive_bank__id\`,
			\`receive_wallet__id\`,
			\`receive_amount\`,

			\`note\`,
			\`created_date\`,
			\`updated_date\`
			) 
			VALUES 
			(
				${req.user.id},

				${send_bank__id},
				11,
				${send_amount},

				${charge},

				${receive_bank__id},
				11,
				${receive_amount},

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
			table: "user_bank_exchange",
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
		if (req.body.send_bank__id == undefined || req.body.send_bank__id == "") {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			send_bank__id = req.body.send_bank__id;
		}
	}

	if (validation) {
		send_bank__id = parseInt(send_bank__id);
		if (
			send_bank__id == undefined ||
			isNaN(send_bank__id) ||
			send_bank__id < 1
		) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowSendBank = await db.getRow({
			table: "bank",
			filter: send_bank__id,
		});

		if (rowSendBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "send_bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.receive_bank__id == undefined ||
			req.body.receive_bank__id == ""
		) {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			receive_bank__id = req.body.receive_bank__id;
		}
	}

	if (validation) {
		receive_bank__id = parseInt(receive_bank__id);
		if (
			receive_bank__id == undefined ||
			isNaN(receive_bank__id) ||
			receive_bank__id < 1
		) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowReceiveBank = await db.getRow({
			table: "bank",
			filter: receive_bank__id,
		});

		if (rowReceiveBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "send_bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.send_amount == undefined || req.body.send_amount == "") {
			validation = false;
			validationMsg = "Send amount required";
			validationData.push({
				field: "send_amount",
				msg: validationMsg,
			});
		} else {
			send_amount = req.body.send_amount;
		}
	}

	if (validation) {
		send_amount = parseFloat(send_amount);
		if (send_amount == undefined || isNaN(send_amount)) {
			validation = false;
			validationMsg = "Send amount is not valid";
			validationData.push({
				field: "send_amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (send_amount < 0) {
			validation = false;
			validationMsg = "Send amount < 0";
			validationData.push({
				field: "send_amount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.charge == undefined || req.body.charge == "") {
			validation = false;
			validationMsg = "Charge amount required";
			validationData.push({
				field: "charge",
				msg: validationMsg,
			});
		} else {
			charge = req.body.charge;
		}
	}

	if (validation) {
		charge = parseFloat(charge);
		if (charge == undefined || isNaN(charge)) {
			validation = false;
			validationMsg = "Charge is not valid";
			validationData.push({
				field: "charge",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (charge < 0) {
			validation = false;
			validationMsg = "Charge amount < 0";
			validationData.push({
				field: "charge",
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
	receive_amount = send_amount - charge;
	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		Update 
			\`user_bank_exchange\` 
		SET 
			\`send_bank__id\` = ${send_bank__id},
			\`receive_bank__id\` = ${receive_bank__id},
			\`send_amount\` = ${send_amount},
			\`charge\` = ${charge},
			\`receive_amount\` = ${receive_amount},
			\`note\` = ${note},
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
			table: "withdraw",
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
			\`user_bank_exchange\` 
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
