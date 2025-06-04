require("dotenv").config();
const CryptoJS = require("crypto-js");
const db = require("./db.service");
const generateTokens = require("../utils/generateTokens.util");
const dateTime = require("../utils/cdate.util.js");

const login = async (login_id, password) => {
	const result = await db.query(
		`
            SELECT
                * 
            FROM 
                user 
            WHERE 
                login_id = ? 
        `,
		[login_id],
	);
	if (result && result.length > 0) {
		textPass = CryptoJS.AES.decrypt(
			result[0].password,
			process.env.SECURITY_PRIVATE_KEY,
		).toString(CryptoJS.enc.Utf8);
		if (textPass == password) {
			const role = CryptoJS.AES.encrypt(
				result[0].user_type,
				process.env.SECURITY_PRIVATE_KEY,
			).toString();
			user = {
				id: result[0].id,
				user_name: result[0].user_name,
				email: result[0].user_name,
				role_key: role,
			};
			const { accessToken, refreshToken } = await generateTokens(user);
			return {
				accessToken: accessToken,
				refreshToken: refreshToken,
				redirect: result[0].user_type,
			};
		} else {
			return false;
		}
	} else {
		return false;
	}
};

const signup = async (user) => {
	const password = CryptoJS.AES.encrypt(
		user.password,
		process.env.SECURITY_PRIVATE_KEY,
	).toString();
	const cdate = dateTime.cDateTime();

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
		[user.login_id, user.user_name, user.email, password, cdate],
	);
	if (result.affectedRows) {
		message = "insert successfully";
	}

	return { message };
};

module.exports = {
	signup,
	login,
};
