require("dotenv").config();
const db = require("./db.service");
const helper = require("../utils/dbHelper.util");

const gets = async (page = 1, listPerPage = 100) => {
	const offset = helper.getOffset(page, listPerPage);
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
