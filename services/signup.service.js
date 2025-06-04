require("dotenv").config();
const db = require("./db.service");

const signup = async (user) => {
	const result = await db.query(
		`
            INSERT INTO
                user
            (
                login_id,
                user_name,
                email,
                password,
                created_date
            ) 
            VALUES 
            (
                ?, 
                ?, 
                ?, 
                ?, 
                ? 
            )
        `,
		[
			user.login_id,
			user.user_name,
			user.email,
			user.password,
			user.created_date,
		],
	);
	if (result.affectedRows) {
		message = "insert successfully";
	}

	return { message };
};

module.exports = {
	signup,
};
