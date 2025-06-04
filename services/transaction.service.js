require("dotenv").config();
const CryptoJS = require("crypto-js");
const db = require("./db.service");
const dateTime = require("../utils/cdate.util.js");
const helper = require("../utils/dbHelper.util");

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
            id, 
            user_name, 
            last_name, 
            first_name, 
            email, 
            phone, 
            image, 
            image_thumb 
        FROM 
            user 
        LIMIT ?,?
    `,
		[offset, listPerPage],
	);
	const data = helper.emptyOrRows(rows);
	const meta = { page, listPerPage };

	return {
		data,
		meta,
	};
};

const get = async (id) => {
	const rows = await db.query(
		`
        SELECT 
            id, 
            user_name, 
            last_name, 
            first_name, 
            email, 
            phone, 
            image, 
            image_thumb 
        FROM 
            user 
		WHERE
			id = ?
    `,
		[id],
	);
	const data = rows[0];
	return data;
};

const insert = async (user) => {
	const result = await db.query(
		`
        INSERT INTO 
            user 
            (
                user_name, 
                login_id 

            ) 
        VALUES 
        (?, ?)
    `,
		[user.user_name, user.login_id],
	);

	let message = "Error in insert ";

	if (result.affectedRows) {
		message = "created successfully";
	}

	return { message };
};

const update = async (id, user) => {
	const result = await db.query(
		`
        UPDATE 
            user 
        SET 
            user_name=? 
        WHERE 
            id=?
    `,
		[user.user_name, id],
	);

	let message = "Error in updating";

	if (result.affectedRows) {
		message = "updated successfully";
	}

	return { message };
};

const remove = async (id) => {
	const result = await db.query(
		`
        DELETE FROM 
            user 
        WHERE 
            id=?
    `,
		[id],
	);

	let message = "Error in deleting";

	if (result.affectedRows) {
		message = "Deleted successfully";
	}

	return { message };
};

module.exports = {
	gets,
	get,
	insert,
	update,
	remove,
};
