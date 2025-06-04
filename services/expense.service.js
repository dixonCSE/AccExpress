require("dotenv").config();
const CryptoJS = require("crypto-js");
const db = require("./db.service.js");
const dateTime = require("../utils/cdate.util.js");
const helper = require("../utils/dbHelper.util.js");

const gets = async (queryObj = false) => {
	let { filter, search, sort_col, sort_dir, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort_col || db.sort_col;
	sort_dir = sort_dir || db.sort_dir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	const rows = await db.query(
		`
			SELECT 
					expense.id AS id, 
					expense.amount AS amount, 
					expense.due AS due, 
					expense.bank__id AS bank__id, 
					expense.expense_type__id AS expense_type__id, 
					expense.name AS name, 
					expense.des AS des, 
					expense.created_date AS created_date, 
					expense.updated_date AS updated_date,

					bank.name AS bank__name,
					expense_type.name AS expense_type__name
			FROM 
					expense AS expense 
					LEFT JOIN expense_type AS expense_type ON expense_type.id = expense.expense_type__id
					LEFT JOIN bank AS bank ON bank.id = expense.bank__id
			WHERE 
				 expense.is_delete = 0
			LIMIT ?,?
    `,
		[offset, listPerPage],
	);
	const data = helper.emptyOrRows(rows);
	const meta = { page, listPerPage };

	return {
		data,
		meta,
		error: false,
		type: "success",
		msg: "successfully fetch data",
	};
};

const insert = async (obj) => {
	const result = await db.query(
		`
			INSERT INTO expense 
			(
				amount, 
				due,
				des,	
				name,	
				bank__id,	
				expense_type__id,	
				created_date,	
				updated_date
			) 
			VALUES 
			(?, ?)
    `,
		[
			obj.amount,
			obj.due,
			obj.name,
			obj.des,
			obj.bank__id,
			obj.expense_type__id,
			dateTime.cDateTime,
			dateTime.cDateTime,
		],
	);

	if (result.affectedRows) {
		return {
			error: false,
			type: "success",
			msg: "created successfully",
		};
	} else {
		return {
			error: false,
			type: "success",
			msg: "Error in insert",
		};
	}
};

module.exports = {
	gets,
	insert,
};
