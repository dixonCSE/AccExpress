require("dotenv").config();
const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");

const db = require("../services/db.service");
const dueService = require("../services/due.service");
const helper = require("../utils/dbHelper.util");
const dateTime = require("../utils/cdate.util.js");
const totalService = require("../services/total.service");

const DTQuery = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	filterMap = {
		id: `\`t1\`.\`id\``,
		id: `\`t1\`.\`phone\``,
	};

	searchStr = "";
	if (search) {
		searchStr = `
			( 
				\`t1\`.\`id\` LIKE '%${search}%' 
				OR 
				\`t1\`.\`company\` LIKE '%${search}%'
				OR 
				\`t1\`.\`user_name\` LIKE '%${search}%'
				OR 
				\`t1\`.\`phone\` LIKE '%${search}%'
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
				\`t1\`.\`login_id\` AS \`login_id\`,
				\`t1\`.\`user_name\` AS \`user_name\`,
				\`t1\`.\`first_name\` AS \`first_name\`,
				\`t1\`.\`email\` AS \`email\`,
				\`t1\`.\`phone\` AS \`phone\`,
				\`t1\`.\`company\` AS \`company\`,
				\`t1\`.\`image\` AS \`image\`,
				\`t1\`.\`is_delete\` AS \`is_delete\`,

			FROM 
				\`user\` AS \`t1\` 
			WHERE
				${filterStr}
				${searchStr}
				\`t1\`.\`is_delete\` = 0
				AND 
				\`t1\`.\`user_role__id\` IN (
					SELECT \`id\` FROM \`user_role\` WHERE \`key_code\` = 'user'
				)
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
				\`user\` AS \`t1\` 
			WHERE
				${filterStr}
				${searchStr}
				\`t1\`.\`is_delete\` = 0
				AND 
				\`t1\`.\`user_role__id\` IN (
					SELECT \`id\` FROM \`user_role\` WHERE \`key_code\` = 'user'
				)
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

const userDataTable = async (queryObj = false) => {
	let { filter, search, sort, order, offset, limit } = queryObj;

	filter = filter || false;
	search = search || false;
	sort_col = sort || db.sortCol;
	sort_dir = order || db.sortDir;
	offset = offset || db.offset;
	limit = limit || db.limit;

	srcStr = "";
	if (search) {
		srcStr = `( user_name LIKE '%${search}%' OR company LIKE '%${search}%' OR phone LIKE '%${search}%' OR email LIKE '%${search}%') AND `;
	}

	// const xrows = await db.query(
	// 	`
	// 		SELECT
	// 			id,
	// 			login_id,
	// 			user_name,
	// 			email,
	// 			phone,
	// 			company,
	// 			image
	// 		FROM
	// 			user
	// 		WHERE
	// 			${srcStr}
	// 			is_delete = 0
	// 			AND
	// 			user_role__id IN (
	// 				SELECT id FROM user_role WHERE key_code = 'user'
	// 			)
	// 		ORDER BY ${sort_col} ${sort_dir}
	// 		LIMIT ${offset},${limit}
	// 	`,
	// 	[],
	// );

	const rows = await db.query(
		`
			SELECT 
				t1.id AS id, 
				t1.login_id AS login_id, 
				t1.user_name AS user_name, 
				t1.first_name AS first_name, 
				t1.email AS email, 
				t1.phone AS phone, 
				t1.company AS company, 
				t1.image AS image, 
				t1.created_date AS created_date,
				(
					SELECT IFNULL(SUM(t2.net), 0) AS net FROM user_service AS t2 WHERE t2.user__id = t1.id AND t2.is_delete = 0 
				) AS net, 
				(
					SELECT IFNULL(SUM(t3.payment), 0) AS payment FROM payment_receive AS t3 WHERE t3.user__id = t1.id AND t3.is_delete = 0 
				) AS payment,
				(
					SELECT IFNULL(SUM(t4.amount), 0) AS old_due FROM previous_due_adv AS t4 WHERE t4.user__id = t1.id AND t4.is_delete = 0 
				) + (
					SELECT IFNULL(SUM(due_pay.amount), 0) AS total FROM due_pay AS due_pay WHERE due_pay.user__id = t1.id AND due_pay.is_delete = 0 
				) AS old_due,
				(
					SELECT IFNULL(SUM(t4x.amount), 0) AS old_due FROM previous_due_adv AS t4x WHERE t4x.user__id = t1.id AND t4x.is_delete = 0 AND t4x.is_due = 1 
				) + (
					SELECT IFNULL(SUM(t2x.net), 0) AS net FROM user_service AS t2x WHERE t2x.user__id = t1.id AND t2x.is_delete = 0 
				) - (
					SELECT IFNULL(SUM(t3x.payment), 0) AS payment FROM payment_receive AS t3x WHERE t3x.user__id = t1.id AND t3x.is_delete = 0 
				) AS total_due
			FROM 
				user AS t1
			WHERE
				${srcStr}
				t1.is_delete = 0
				AND 
				t1.user_role__id IN (
					SELECT id FROM user_role WHERE key_code = 'user'
				)
			ORDER BY ${sort_col} ${sort_dir}
			LIMIT ${offset},${limit}
		`,
		[],
	);

	const count = await db.query(
		`
			SELECT 
				IFNULL(COUNT(t1.id), 0) AS cnt 
			FROM 
				user AS t1
			WHERE
				${srcStr}
				t1.is_delete = 0
				AND 
				t1.user_role__id IN (
					SELECT id FROM user_role WHERE key_code = 'user'
				)
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

const userList = async (req, res, next) => {
	try {
		const sqlRes = await userDataTable(req.query);

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
			logout: false,
			msg: "Try block Error",
			devMsg: err,
		});
		return true;
	}
};

const userGet = async (req, res, next) => {
	try {
		const sqlRes = await db.getRow({
			table: "user",
			filter: req.params.id,
		});

		if (sqlRes == false) {
			res.status(404).json({
				error: true,
				type: "error",
				msg: "error",
			});
			return false;
		}

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes,
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
			table: "user",
			filter: {
				user_role__id: 10,
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

const userDetail = async (req, res, next) => {
	try {
		const user = await db.getRow({
			table: "user",
			filter: req.params.id,
		});

		if (user == false) {
			res.status(404).json({
				error: true,
				type: "error",
				msg: "user not found",
			});
			return false;
		} else {
			resData = {};
			resData.user = user;

			const userService = await db.query(
				`
					SELECT 
					t1.id AS id, 
					t1.user__id AS user__id, 
					t1.service__id AS service__id, 
					t1.wallet__id AS wallet__id, 
					t1.bank__id AS bank__id, 
					t1.price AS price, 
					t1.discount AS discount, 
					t1.net AS net, 
					t1.payment AS payment, 
					t1.due AS due, 
					t1.is_boost AS is_boost, 
					t1.is_install AS is_install, 
					t1.auto_renew AS auto_renew, 
					t1.is_closed AS is_closed, 
					t1.created_date AS created_date,

					service_type.id AS service_type__id,
					t2.name AS service__name, 
					t2.image AS service__image, 
					t3.user_name AS user__user_name, 
					t3.image AS user__image, 
					t3.phone AS user__phone, 
					t3.company AS user__company, 
					t4.name AS bank__name, 
					t5.name AS wallet__name
				FROM 
					user_service AS t1
					LEFT JOIN service AS t2 ON t2.id = t1.service__id 
					LEFT JOIN service_type AS service_type ON service_type.id = t2.service_type__id 
					LEFT JOIN user AS t3 ON t3.id = t1.user__id 
					LEFT JOIN bank AS t4 ON t4.id = t1.bank__id 
					LEFT JOIN wallet AS t5 ON t5.id = t1.wallet__id
				WHERE
					t1.is_delete = 0
					AND 
					t1.user__id = ?
	
				ORDER BY t1.id DESC
				LIMIT 0,9999
				`,
				[req.params.id],
			);
			resData.userService = userService;

			const userGenService = await db.query(
				`
					SELECT 
					t1.id AS id, 
					t1.user__id AS user__id, 
					t1.service__id AS service__id, 
					t1.wallet__id AS wallet__id, 
					t1.bank__id AS bank__id, 
					t1.price AS price, 
					t1.discount AS discount, 
					t1.net AS net, 
					t1.payment AS payment, 
					t1.due AS due, 
					t1.is_boost AS is_boost, 
					t1.is_install AS is_install, 
					t1.auto_renew AS auto_renew, 
					t1.is_closed AS is_closed, 
					t1.created_date AS created_date,

					service_type.id AS service_type__id,
					t2.name AS service__name, 
					t2.image AS service__image, 
					t3.user_name AS user__user_name, 
					t3.image AS user__image, 
					t3.phone AS user__phone, 
					t3.company AS user__company, 
					t4.name AS bank__name, 
					t5.name AS wallet__name
				FROM 
					user_service AS t1
					LEFT JOIN service AS t2 ON t2.id = t1.service__id 
					LEFT JOIN service_type AS service_type ON service_type.id = t2.service_type__id 
					LEFT JOIN user AS t3 ON t3.id = t1.user__id 
					LEFT JOIN bank AS t4 ON t4.id = t1.bank__id 
					LEFT JOIN wallet AS t5 ON t5.id = t1.wallet__id
				WHERE
					t1.is_delete = 0
					AND 
					t1.user__id = ?
					AND
					service_type.id = 1
	
				ORDER BY t1.id DESC
				LIMIT 0,9999
				`,
				[req.params.id],
			);
			resData.userGenService = userGenService;

			/* const userBoostService = await db.query(
				`
					SELECT 
					t1.id AS id, 
					t1.user__id AS user__id, 
					t1.service__id AS service__id, 
					t1.wallet__id AS wallet__id, 
					t1.bank__id AS bank__id, 
					t1.price AS price, 
					t1.discount AS discount, 
					t1.net AS net, 
					t1.payment AS payment, 
					t1.due AS due, 
					t1.is_boost AS is_boost, 
					t1.is_closed AS is_closed, 
					t1.is_install AS is_install, 
					t1.auto_renew AS auto_renew, 
					t1.created_date AS created_date,

					service_type.id AS service_type__id,
					t2.name AS service__name, 
					t2.image AS service__image, 
					t3.user_name AS user__user_name, 
					t3.image AS user__image, 
					t3.phone AS user__phone, 
					t3.company AS user__company, 
					t4.name AS bank__name, 
					t5.name AS wallet__name
				FROM 
					user_service AS t1
					LEFT JOIN service AS t2 ON t2.id = t1.service__id 
					LEFT JOIN service_type AS service_type ON service_type.id = t2.service_type__id 
					LEFT JOIN user AS t3 ON t3.id = t1.user__id 
					LEFT JOIN bank AS t4 ON t4.id = t1.bank__id 
					LEFT JOIN wallet AS t5 ON t5.id = t1.wallet__id
				WHERE
					t1.is_delete = 0
					AND 
					t1.user__id = ?
					AND
					service_type.id = 2
	
				ORDER BY t1.id DESC
				LIMIT 0,9999
				`,
				[req.params.id],
			); */
			// resData.userBoostService = userBoostService;

			///////////
			const userBoostService = await db.query(
				`
					SELECT 
						\`t1\`.*, 
						\`user_service\`.\`id\` AS \`user_service__id\`, 
						\`user_service\`.\`user__id\` AS \`user__id\`, 
						\`user_service\`.\`service__id\` AS \`service__id\`, 
						\`user_service\`.\`price\` AS \`price\`, 
						\`user_service\`.\`discount\` AS \`discount\`, 
						\`user_service\`.\`net\` AS \`net\`,

						\`service_type\`.\`id\` AS \`service_type__id\`,
						\`service\`.\`name\` AS \`service__name\`, 
						\`service\`.\`image\` AS \`service__image\` 
					FROM 
						\`user_date_service\` AS \`t1\`
						LEFT JOIN \`user_service\` AS \`user_service\` ON \`user_service\`.\`id\` = \`t1\`.\`user_service__id\` 
						LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`user_service\`.\`service__id\` 
						LEFT JOIN \`service_type\` AS \`service_type\` ON \`service_type\`.\`id\` = \`service\`.\`service_type__id\` 
					WHERE
						\`t1\`.\`is_delete\` = 0
						AND 
						\`user_service\`.\`is_delete\` = 0
						AND 
						\`user_service\`.\`user__id\` = ?
						AND
						\`service_type\`.\`id\` = 2
					ORDER BY \`t1\`.\`end_date\` DESC
					LIMIT 0,9999
				`,
				[req.params.id],
			);
			resData.userBoostService = userBoostService;
			///////////

			const userDurService = await db.query(
				`
					SELECT 
					\`t1\`.\`id\` AS \`id\`, 
					\`t1\`.\`user__id\` AS \`user__id\`, 
					\`t1\`.\`service__id\` AS \`service__id\`, 
					\`t1\`.\`wallet__id\` AS \`wallet__id\`, 
					\`t1\`.\`bank__id\` AS \`bank__id\`, 
					\`t1\`.\`price\` AS \`price\`, 
					\`t1\`.\`discount\` AS \`discount\`, 
					\`t1\`.\`net\` AS \`net\`, 
					\`t1\`.\`payment\` AS \`payment\`, 
					\`t1\`.\`due\` AS \`due\`, 
					\`t1\`.\`is_boost\` AS \`is_boost\`, 
					\`t1\`.\`is_install\` AS \`is_install\`, 
					\`t1\`.\`auto_renew\` AS \`auto_renew\`, 
					\`t1\`.\`is_closed\` AS \`is_closed\`, 
					\`t1\`.\`start_date\` AS \`start_date\`, 
					\`t1\`.\`end_date\` AS \`end_date\`, 
					\`t1\`.\`remind_date\` AS \`remind_date\`, 
					\`t1\`.\`renew_date\` AS \`renew_date\`, 
					\`t1\`.\`created_date\` AS \`created_date\`,

					\`service_type\`.\`id\` AS \`service_type__id\`,
					\`t2\`.\`name\` AS \`service__name\`, 
					\`t2\`.\`image\` AS \`service__image\`, 
					\`t3\`.\`user_name\` AS \`user__user_name\`, 
					\`t3\`.\`image\` AS \`user__image\`, 
					\`t3\`.\`phone\` AS \`user__phone\`, 
					\`t3\`.\`company\` AS \`user__company\`, 
					\`t4\`.\`name\` AS \`bank__name\`, 
					\`t5\`.\`name\` AS \`wallet__name\`
				FROM 
					\`user_service\` AS \`t1\`
					LEFT JOIN \`service\` AS \`t2\` ON \`t2\`.\`id\` = \`t1\`.\`service__id\` 
					LEFT JOIN \`service_type\` AS \`service_type\` ON \`service_type\`.\`id\` = \`t2\`.\`service_type__id\` 
					LEFT JOIN \`user\` AS \`t3\` ON \`t3\`.\`id\` = \`t1\`.\`user__id\` 
					LEFT JOIN \`bank\` AS \`t4\` ON \`t4\`.\`id\` = \`t1\`.\`bank__id\` 
					LEFT JOIN \`wallet\` AS \`t5\` ON \`t5\`.\`id\` = \`t1\`.\`wallet__id\`
				WHERE
					\`t1\`.\`is_delete\` = 0
					AND 
					\`t1\`.\`user__id\` = ?
					AND
					\`service_type\`.\`id\` = 3
	
				ORDER BY \`t1\`.\`is_closed\` ASC, \`t1\`.\`id\` DESC
				LIMIT 0,9999
				`,
				[req.params.id],
			);
			resData.userDurService = userDurService;

			const payment = await db.query(
				`
					SELECT 
						t1.id AS id, 
						t1.user__id AS user__id, 
						t1.user_service__id AS user_service__id, 
						t1.wallet__id AS wallet__id, 
						t1.bank__id AS bank__id, 
						t1.payment AS payment, 
						t1.trxid AS trxid, 
						t1.note AS note, 
						t1.created_date AS created_date,
						t1.payment_date AS payment_date,
	
						t3.user_name AS user__user_name, 
						t3.image AS user__image, 
						t3.phone AS user__phone, 
						t4.name AS bank__name, 
						t5.name AS wallet__name
					FROM 
						payment_receive AS t1 
						LEFT JOIN user AS t3 ON t3.id = t1.user__id 
						LEFT JOIN bank AS t4 ON t4.id = t1.bank__id 
						LEFT JOIN wallet AS t5 ON t5.id = t1.wallet__id
					WHERE
						t1.is_delete = 0
						AND 
						t1.user__id = ?
					ORDER BY t1.id DESC
					LIMIT 0,9999	
				`,
				[req.params.id],
			);
			resData.payment = payment;

			resData.totalSale = await totalService.totalSaleByUser(req.params.id);
			resData.totalSaleCount = await totalService.countSaleByUser(
				req.params.id,
			);
			resData.totalDue = await totalService.totalDueByUser(req.params.id);
			resData.OldDue = await totalService.OldDueByUser(req.params.id);
			resData.totalAdv = await totalService.totalAdvByUser(req.params.id);
			resData.totalPaid = await totalService.totalPaidByUser(req.params.id);

			res.status(200).json({
				error: false,
				type: "success",
				msg: "Access granted",
				data: resData,
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

const userInsert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (!req.file) {
		filePath = `/public/media/user/default.png`;
	} else {
		filePath = `${req.file.destination}${req.file.filename}`.substring(1);
	}

	if (validation) {
		if (req.body.user_name == undefined || req.body.user_name == "") {
			validation = false;
			validationMsg = "User name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			user_name = req.body.user_name;
		}
	}

	if (validation) {
		if (req.body.first_name == undefined || req.body.first_name == "") {
			validation = false;
			validationMsg = "Full name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			first_name = req.body.first_name.trim().toString();
		}
	}

	if (validation) {
		resultTmp = await db.query(
			`
				SELECT
					IFNULL(COUNT(*), 0) AS count
				FROM 
					user
				WHERE 
					login_id = ? 
				LIMIT 0, 1
			`,
			[user_name],
		);

		if (resultTmp && parseInt(resultTmp[0]["count"]) > 0) {
			validation = false;
			validationMsg = "user name is not available";
			validationData.push({
				field: "user_name",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.email == undefined || req.body.email == "") {
			/* 
			validation = false;
			validationMsg = "User email required";
			validationData.push({
				field: "email",
				msg: validationMsg,
			}); 
			*/
			email = `null`;
		} else {
			email = `'${req.body.email.toString()}'`;
		}
	}

	if (validation) {
		if (req.body.phone == undefined || req.body.phone == "") {
			/* validation = false;
			validationMsg = "User phone required";
			validationData.push({
				field: "phone",
				msg: validationMsg,
			}); */
			phone = `null`;
		} else {
			phone = `'${req.body.phone.toString()}'`;
		}
	}

	if (validation) {
		if (req.body.company == undefined || req.body.company == "") {
			/* validation = false;
			validationMsg = "User company required";
			validationData.push({
				field: "company",
				msg: validationMsg,
			}); */
			company = `null`;
		} else {
			company = `'${req.body.company.toString()}'`;
		}
	}

	if (validation) {
		if (req.body.password == undefined || req.body.password == "") {
			validation = false;
			validationMsg = "User password required";
			validationData.push({
				field: "password",
				msg: validationMsg,
			});
		} else {
			password = CryptoJS.AES.encrypt(
				req.body.password,
				process.env.SECURITY_PRIVATE_KEY,
			).toString();
		}
	}

	if (validation) {
		if (
			req.body.confirm_password == undefined ||
			req.body.confirm_password == ""
		) {
			validation = false;
			validationMsg = "User confirm password required";
			validationData.push({
				field: "confirm_password",
				msg: validationMsg,
			});
		} else {
			confirm_password = req.body.confirm_password.toString();
		}
	}

	if (validation) {
		if (req.body.password.toString() !== confirm_password) {
			validation = false;
			validationMsg = "User confirm password not match";
			validationData.push({
				field: "confirm_password",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.dueAmount == undefined || req.body.dueAmount == "") {
			dueAmount = 0;
		} else {
			dueAmount = req.body.dueAmount;
		}
	}

	if (validation) {
		dueAmount = parseFloat(dueAmount);
		if (dueAmount == undefined || isNaN(dueAmount)) {
			// validation = false;
			// validationMsg = "User dueAmount is not valid";
			// validationData.push({
			// 	field: "dueAmount",
			// 	msg: validationMsg,
			// });
			dueAmount = 0;
		}
	}

	if (validation) {
		if (dueAmount < 0) {
			validation = false;
			validationMsg = "Service dueAmount < 0";
			validationData.push({
				field: "dueAmount",
				msg: validationMsg,
			});
		}
	}

	/* 
	if (validation) {
		if (req.body.user_role__id == undefined || req.body.user_role__id == "") {
			validation = false;
			validationMsg = "User Role required";
			validationData.push({
				field: "user_role",
				msg: validationMsg,
			});
		} else {
			user_role__id = req.body.user_role__id;
		}
	}
	*/

	/* if (validation) {
		user_role__id = parseInt(user_role__id);
		if (
			user_role__id == undefined ||
			isNaN(user_role__id) ||
			user_role__id < 1
		) {
			validation = false;
			validationMsg = "User Role is not valid";
			validationData.push({
				field: "user_role",
				msg: validationMsg,
			});
		}
	} */

	/* if (validation) {
		rowRole = await db.getRow({
			table: "user_role",
			filter: user_role__id,
		});

		if (rowRole == false) {
			validation = false;
			validationMsg = "User Role is not found";
			validationData.push({
				field: "user_role",
				msg: validationMsg,
			});
		}
	} */

	if (validation) {
		if (req.body.dueNote == undefined || req.body.dueNote == "") {
			dueNote = `null`;
		} else {
			dueNote = `'${req.body.dueNote.trim().toString()}'`;
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

	rowRole = await db.getRow({
		table: "user_role",
		filter: { key_code: "user" },
	});

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		INSERT INTO user (
			login_id,
			user_name,
			first_name,
			image,
			email,
			phone,
			company,

			password,

			user_role__id,
			created_date,
			updated_date
			) VALUES (
			'${user_name}',
			'${user_name}',
			'${first_name}',
			'${filePath}',
			${email},
			${phone},
			${company},

			'${password}',

			${rowRole.id},
			'${cdate}',
			'${cdate}'
		);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @id = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	if (rowRole.key_code == "user") {
		if (dueAmount > 0) {
			sqltmp = `
				INSERT INTO previous_due_adv (
					user__id,
					amount,
					st_amount,
					note,

					created_date,
					updated_date
					) VALUES (
					@id,
					'${dueAmount}',
					'${dueAmount}',
					${dueNote},

					'${cdate}',
					'${cdate}'
				);
			`;
			sqlArray.push(sqltmp);
		}
	}

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

const userUpdate = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.id == undefined || req.body.id == "") {
			validation = false;
			validationMsg = "ID required";
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
			validationMsg = "ID not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "user",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "ID not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			filePath = row.image;
			if (req.file) {
				filePath = `${req.file.destination}${req.file.filename}`.substring(1);
			}
		}
	}

	if (validation) {
		if (req.body.user_name == undefined || req.body.user_name == "") {
			validation = false;
			validationMsg = "User name required";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			user_name = req.body.user_name;
		}
	}

	if (validation) {
		if (user_name == row.user_name) {
		} else {
			resultTmp = await db.query(
				`
					SELECT
						IFNULL(COUNT(*), 0) AS count
					FROM 
						user
					WHERE 
						login_id = ? 
					LIMIT 0, 1
				`,
				[user_name],
			);

			if (resultTmp && parseInt(resultTmp[0]["count"]) > 0) {
				validation = false;
				validationMsg = "user name already exist";
				validationData.push({
					field: "user_name",
					msg: validationMsg,
				});
			}
		}
	}

	if (validation) {
		if (req.body.first_name == undefined || req.body.first_name == "") {
			validation = false;
			validationMsg = "First name required";
			validationData.push({
				field: "first_name",
				msg: validationMsg,
			});
		} else {
			first_name = req.body.first_name;
		}
	}

	if (validation) {
		if (req.body.email == undefined || req.body.email == "") {
			/* 
			validation = false;
			validationMsg = "User email required";
			validationData.push({
				field: "email",
				msg: validationMsg,
			});
			*/
			email = `null`;
		} else {
			email = `'${req.body.email}'`;
		}
	}

	if (validation) {
		if (req.body.phone == undefined || req.body.phone == "") {
			/* 
			validation = false;
			validationMsg = "User phone required";
			validationData.push({
				field: "phone",
				msg: validationMsg,
			}); 
			*/
			phone = `null`;
		} else {
			phone = `'${req.body.phone}'`;
		}
	}

	if (validation) {
		if (req.body.company == undefined || req.body.company == "") {
			/* 
			validation = false;
			validationMsg = "User company required";
			validationData.push({
				field: "company",
				msg: validationMsg,
			}); 
			*/
			company = `null`;
		} else {
			company = `'${req.body.company}'`;
		}
	}

	if (validation) {
		if (req.body.password == undefined || req.body.password == "") {
			/* 
			validation = false;
			validationMsg = "User password required";
			validationData.push({
				field: "password",
				msg: validationMsg,
			}); 
			*/
			password = row.password;
		} else {
			password = CryptoJS.AES.encrypt(
				req.body.password,
				process.env.SECURITY_PRIVATE_KEY,
			).toString();
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
		UPDATE 
			user 
		SET 
			login_id = '${user_name}',
			user_name = '${user_name}',
			first_name = '${first_name}',
			email = ${email},
			phone = ${phone},
			company = ${company},
			image = '${filePath}',
			password = '${password}',
			updated_date = '${cdate}'
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			if (
				typeof row.image !== "undefined" &&
				row.image.match("default.png") != null
			) {
			} else {
				const _filePath = path.join(__dirname, "../", row.image);
				/* fs.unlink(_filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err}`);
					} else {
						console.log("204");
					}
				}); */
			}

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

const userDelete = async (req, res, next) => {
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
			table: "user",
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
			user 
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
			/* 
			if ( typeof row.image !== 'undefined' && row.image.match('default.png') != null) {} else {
				const _filePath = path.join(__dirname, "../", row.image);
				fs.unlink(_filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err}`);
					} else {
						console.log("204");
					}
				}); 
			}
			*/
			//----------------------------------------------------//
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
	userList,
	userGet,
	Gets,
	userDetail,
	userUpdate,
	userInsert,
	userDelete,
};
