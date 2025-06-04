require("dotenv").config();
const db = require("../services/db.service");
const dueService = require("../services/due.service");
const advSrv = require("../services/adv.service");
const helper = require("../utils/dbHelper.util");
const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");
const sms = require("../services/sms.service");

const recalUserService = async (user_service__id = false) => {
	//console.log("recalUserService");
	//console.log(user_service__id);
	if (user_service__id) {
		rowUserService = await db.getRow({
			table: "user_service",
			filter: user_service__id,
		});
		//console.log(rowUserService);

		if (rowUserService != false) {
			rowsUserServicePayment = await db.getRows({
				table: "user_service_payment",
				filter: {
					user_service__id: user_service__id,
					is_delete: 0,
				},
			});

			totalPayment = 0;
			rowsUserServicePayment.forEach((element) => {
				totalPayment += nf.dec(element.amount);
			});

			newPayment = nf.dec(totalPayment);
			newDue = nf.dec(rowUserService.net) - newPayment;

			cdate = dateTime.cDateTime();

			//console.log("rowUserService.id ---", rowUserService.id);
			//console.log(`${newPayment} = ${rowUserService.net} - ${newPayment}`);
			//console.log("rowUserService.id--", rowUserService.id);

			let sqlArray = [];
			let sqltmp;

			sqltmp = `
				Update 
					user_service 
				SET 
					payment = ${newPayment},
					due = ${newDue},
					updated_date = '${cdate}'
				WHERE 
					id = ${user_service__id}
				;
			`;
			sqlArray.push(sqltmp);

			try {
				const sqlres = await db.trx(sqlArray);
				if (sqlres) {
					return {
						error: false,
						type: "success",
						msg: "success",
					};
				} else {
					return {
						error: true,
						type: "error",
						msg: "sql error",
					};
				}
			} catch (err) {
				return {
					error: true,
					type: "error",
					msg: "db transaction try error",
					dev: sqlArray,
					dev2: err,
				};
			}
		}
	}
};

const receiveDataTable = async (queryObj = false) => {
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
				t3.user_name LIKE '%${search}%' 
				OR 
				t3.company LIKE '%${search}%' 
				OR 
				t3.phone LIKE '%${search}%' 
				OR 
				t4.name LIKE '%${search}%'
			) 
			AND 
		`;
	}

	const rows = await db.query(
		`
			SELECT 
				t1.id AS id, 
				t1.user__id AS user__id, 
				t1.user_service__id AS user_service__id, 
				t1.wallet__id AS wallet__id, 
				t1.bank__id AS bank__id, 
				t1.payment AS payment, 
				t1.note AS note, 
				t1.created_date AS created_date,

				t3.user_name AS user__user_name, 
				t3.image AS user__image, 
				t3.company AS user__company, 
				t3.phone AS user__phone, 
				t4.name AS bank__name, 
				t5.name AS wallet__name
			FROM 
				payment_receive AS t1 
				LEFT JOIN user AS t3 ON t3.id = t1.user__id 
				LEFT JOIN bank AS t4 ON t4.id = t1.bank__id 
				LEFT JOIN wallet AS t5 ON t5.id = t1.wallet__id
			WHERE
				${srcStr}
				t1.is_delete = 0
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
				payment_receive AS t1 
				LEFT JOIN user AS t3 ON t3.id = t1.user__id 
				LEFT JOIN bank AS t4 ON t4.id = t1.bank__id 
				LEFT JOIN wallet AS t5 ON t5.id = t1.wallet__id
			WHERE
				${srcStr}
				t1.is_delete = 0
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

const receiveList = async (req, res, next) => {
	try {
		const sqlRes = await receiveDataTable(req.query);

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes.data,
			count: sqlRes.meta.count,
		});
		return false;
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return false;
	}
};

const receiveView = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const receiveGet = async (req, res, next) => {
	try {
		const rows = await db.getRow({
			table: "payment_receive",
			filter: req.params.id,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const receiveGetByUser = async (req, res, next) => {
	try {
		const sqlRes = await db.query(
			`
				SELECT 
					t1.id AS id, 
					t1.user__id AS user__id, 
					t1.user_service__id AS user_service__id, 
					t1.wallet__id AS wallet__id, 
					t1.bank__id AS bank__id, 
					t1.payment AS payment, 
					t1.note AS note, 
					t1.created_date AS created_date,

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

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			data: sqlRes,
		});
		return false;
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return false;
	}
};

const receiveInsert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.note == undefined || req.body.note == "") {
			note = `null`;
		} else {
			note = `'${req.body.note.trim().toString()}'`;
		}
	}

	if (validation) {
		if (req.body.user__id == undefined || req.body.user__id == "") {
			validation = false;
			validationMsg = "User required";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		} else {
			user__id = req.body.user__id;
		}
	}

	if (validation) {
		user__id = parseInt(user__id);
		if (user__id == undefined || isNaN(user__id) || user__id < 1) {
			validation = false;
			validationMsg = "User is not valid";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowUser = await db.getRow({
			table: "user",
			filter: user__id,
		});

		if (rowUser == false) {
			validation = false;
			validationMsg = "User is not found";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.bank__id == undefined || req.body.bank__id == "") {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		} else {
			bank__id = req.body.bank__id;
		}
	}

	if (validation) {
		bank__id = parseInt(bank__id);
		if (bank__id == undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowBank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (rowBank == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	// t1 = true;
	// if (validation && t1) {
	// 	if (req.body.service__id == undefined || req.body.service__id == "") {
	// 		// validation = false;
	// 		// validationMsg = "Sevice required";
	// 		// validationData.push({
	// 		// 	field: "service",
	// 		// 	msg: validationMsg,
	// 		// });
	// 		t1 = false;
	// 	} else {
	// 		service__id = req.body.service__id;
	// 	}
	// }

	// if (validation && t1) {
	// 	service__id = parseInt(service__id);
	// 	if (service__id == undefined || isNaN(service__id) || service__id < 1) {
	// 		validation = false;
	// 		validationMsg = "Service is not valid";
	// 		validationData.push({
	// 			field: "service",
	// 			msg: validationMsg,
	// 		});
	// 	}
	// }

	// rowService = false;
	// if (validation && t1) {
	// 	rowService = await db.getRow({
	// 		table: "service",
	// 		filter: service__id,
	// 	});

	// 	if (rowService == false) {
	// 		validation = false;
	// 		validationMsg = "Service is not found";
	// 		validationData.push({
	// 			field: "service",
	// 			msg: validationMsg,
	// 		});
	// 	}
	// }

	if (validation) {
		if (req.body.payment == undefined || req.body.payment == "") {
			validation = false;
			validationMsg = "Service payment required";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment == undefined || isNaN(payment)) {
			validation = false;
			validationMsg = "Service payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
		}
	}

	if (validation) {
		if (payment < 0) {
			validation = false;
			validationMsg = "Service payment < 0";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.trxid === undefined ||
			req.body.trxid == "" ||
			req.body.trxid === null
		) {
			trxid = `null`;
		} else {
			trxid = `'${req.body.trxid.trim().toString()}'`;
		}
	}

	if (validation) {
		if (req.body.isSms == undefined || req.body.isSms == "") {
			isSms = false;
		} else {
			isSms = !!req.body.isSms;
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
	avd = nf.dec(await advSrv.getBUser(user__id));
	oldDue = nf.dec(await dueService.getOld(user__id));
	totalOldDue = nf.dec(await dueService.getTotal(user__id));

	rowsUserService = await db.getRows({
		table: "user_service",
		filter: {
			user__id: user__id,
			"due >": 0,
			is_delete: 0,
		},
	});

	let sqlArray = [];
	let sqltmp;

	// sqltmp = `
	// 	INSERT INTO payment_receive (
	// 		user__id,
	// 		service__id,
	// 		bank__id,
	// 		wallet__id,
	// 		payment,

	// 		note,
	// 		created_date,
	// 		updated_date
	// 		)
	// 		VALUES
	// 		(
	// 			${user__id},
	// 			${service__id},
	// 			${bank__id},
	// 			11,
	// 			${payment},

	// 			${note},

	// 			'${cdate}',
	// 			'${cdate}'
	// 		);
	// `;
	// sqlArray.push(sqltmp);

	sqltmp = `
		INSERT INTO 
			\`payment_receive\` 
			(
				\`user__id\`,
				\`bank__id\`,
				\`wallet__id\`,
				\`payment\`,

				\`trxid\`,
				\`note\`,
				\`created_date\`,
				\`updated_date\`
			) 
			VALUES 
			(
				${user__id},
				${bank__id},
				11,
				${payment},

				${trxid},
				${note},
				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	if (avd <= 0) {
		avd = 0;
	}
	tmpRest = nf.dec(payment + avd);

	if (oldDue <= 0) {
	} else {
		xDue = oldDue;
		if (tmpRest > xDue) {
			tmpRest = nf.dec(tmpRest - xDue);
			tmpAmount = xDue;
		} else {
			tmpAmount = tmpRest;
			tmpRest = 0;
		}

		sqltmp = `
			INSERT INTO 
				due_pay 
				(
					user__id,
					amount,
					payment_receive__id,
					created_date,
					updated_date
				)
			VALUES
			(
				${user__id},
				${tmpAmount},
				@liid,
				'${cdate}',
				'${cdate}'
			);
		`;
		sqlArray.push(sqltmp);
	}

	if (rowsUserService.length > 0) {
		if (tmpRest > 0) {
			rowsUserService.forEach((element) => {
				eId = parseInt(element.id);
				eDue = nf.dec(element.due);
				ePayment = nf.dec(element.payment);
				if (eDue < tmpRest) {
					duePayment = eDue;
					tmpRest = nf.dec(tmpRest - duePayment);
				} else {
					duePayment = tmpRest;
					tmpRest = 0;
				}
				if (duePayment > 0) {
					tmpPayment = nf.dec(ePayment + duePayment);
					tmpDue = nf.dec(eDue - duePayment);

					sqltmp = `
						UPDATE 
							user_service 
						SET 
							payment = ${tmpPayment},
							due = ${tmpDue},
							updated_date = '${cdate}'
						WHERE 
							id = ${eId}
						;
					`;
					sqlArray.push(sqltmp);

					sqltmp = `
						INSERT INTO user_service_payment (
							user_service__id,
							amount,

							payment_receive__id,
							created_date,
							updated_date
							) 
							VALUES 
							(
								${eId},
								${duePayment},

								@liid,
								'${cdate}',
								'${cdate}'
							);
					`;
					sqlArray.push(sqltmp);
				}
				if (tmpRest <= 0) {
					return;
				}
			});

			// if (tmpRest > 0) {
			// 	sqltmp = `
			// 			UPDATE
			// 				user
			// 			SET
			// 				adv = ${tmpRest}
			// 			WHERE id = ${user__id};
			// 		`;
			// 	sqlArray.push(sqltmp);
			// }
		}
	}

	try {
		const sqlres = await db.trx(sqlArray);

		if (sqlres) {
			if (isSms) {
				let cdue = nf.dec(await dueService.getTotal(user__id));
				let cavd = nf.dec(await advSrv.getBUser(user__id));
				let totalPayable = nf.dec(totalOldDue - avd);
				let to = rowUser.phone;
				/* 
				msg = `
					Dear ${rowUser.first_name},\n
					Thanks for your payment!\n\n
					Payment Summary:\n
					Previous Due: ${totalOldDue}\n
					Advance: ${avd}\n
					Total Payable:${totalPayable}\n
					Amount Paid: ${payment}\n
					Current Due: ${cdue}\n
					Current Advance: ${cavd}\n\n
					Need help? Just reply or call us.\n
					PROVATi IT
				`; 
				*/
				msg = `Dear ${rowUser.first_name},\nThanks for your payment!\n\nPayment Summary:\nPrevious Due: ${totalOldDue}\nAdvance: ${avd}\nTotal Payable:${totalPayable}\nAmount Paid: ${payment}\nCurrent Due: ${cdue}\nCurrent Advance: ${cavd}\n\nNeed help? Just reply or call us.\nPROVATi IT`;
				smsRes = await sms.sendSms(to, msg);
				if (smsRes == true) {
					res.status(200).json({
						error: false,
						type: "success",
						msg: "success",
					});
					return true;
				} else {
					res.status(200).json({
						error: false,
						type: "warn",
						msg: "sms send error",
					});
					return true;
				}
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

const receiveUpdate = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.id == undefined || req.body.id == "") {
			validation = false;
			validationMsg = "Payment Receive ID required";
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
			validationMsg = "Payment Receive ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "payment_receive",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Payment Receive ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.bank__id == undefined || req.body.bank__id == "") {
			validation = false;
			validationMsg = "Bank required";
			validationData.push({
				field: "bank__id",
				msg: validationMsg,
			});
		} else {
			bank__id = req.body.bank__id;
		}
	}

	if (validation) {
		bank__id = parseInt(bank__id);
		if (bank__id == undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowBank = await db.getRow({
			table: "bank",
			filter: bank__id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "Bank is not found";
			validationData.push({
				field: "bank__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.payment == undefined || req.body.payment == "") {
			validation = false;
			validationMsg = "Service payment required";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment == undefined || isNaN(payment)) {
			validation = false;
			validationMsg = "Service payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
		}
	}

	if (validation) {
		if (payment < 0) {
			validation = false;
			validationMsg = "Service payment < 0";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.trxid === undefined ||
			req.body.trxid == "" ||
			req.body.trxid === null
		) {
			trxid = `null`;
		} else {
			trxid = `'${req.body.trxid.trim().toString()}'`;
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

	user_service_payment = await db.getRows({
		table: "user_service_payment",
		filter: {
			payment_receive__id: id,
			is_delete: 0,
		},
	});

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE
			\`payment_receive\`
		SET
			\`bank__id\` = ${bank__id},
			\`payment\` = ${payment},
			\`trxid\` = ${trxid},
			\`updated_date\` = '${cdate}'
		WHERE
			\`id\` = ${row.id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		UPDATE
			\`user_service_payment\`
		SET
			\`is_delete\` = 1,
			\`updated_date\` = '${cdate}'
		WHERE
			\`payment_receive__id\` = ${row.id}
			AND
			\`is_delete\` = 0
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		UPDATE
			\`due_pay\`
		SET
			\`is_delete\` = 1,
			\`updated_date\` = '${cdate}'
		WHERE
			\`payment_receive__id\` = ${row.id}
			AND
			\`is_delete\` = 0
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			sqlArray = [];
			// if (true) {
			// console.log("sqlres");
			// console.log(user_service_payment.length);
			if (user_service_payment.length > 0) {
				for (element of user_service_payment) {
					console.log("call--", element.id);
					await recalUserService(element.user_service__id);
				}
			}

			rowsUserService = await db.getRows({
				table: "user_service",
				filter: {
					user__id: row.user__id,
					"due >": 0,
					is_delete: 0,
				},
			});

			if (rowsUserService.length > 0) {
				tmpRest = payment;
				for (element of rowsUserService) {
					eId = parseInt(element.id);
					eDue = parseFloat(element.due);
					ePayment = parseFloat(element.payment);
					if (eDue < tmpRest) {
						duePayment = eDue;
						tmpRest = tmpRest - duePayment;
					} else {
						duePayment = tmpRest;
						tmpRest = 0;
					}
					if (duePayment > 0) {
						tmpPayment = ePayment + duePayment;
						tmpDue = eDue - duePayment;

						sqltmp = `
							Update
								user_service
							SET
								payment = ${tmpPayment},
								due = ${tmpDue},
								updated_date = '${cdate}'
							WHERE
								id = ${eId}
							;
						`;
						sqlArray.push(sqltmp);

						sqltmp = `
							INSERT INTO user_service_payment (
								user_service__id,
								amount,

								payment_receive__id,
								created_date,
								updated_date
								)
								VALUES
								(
									${eId},
									${duePayment},

									${row.id},
									'${cdate}',
									'${cdate}'
								);
						`;
						sqlArray.push(sqltmp);
					}
					if (tmpRest <= 0) break;
				}
				const sqlres2 = await db.trx(sqlArray);
			}

			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return false;
	}
};

const receiveDelete = async (req, res, next) => {
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
			table: "payment_receive",
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

	user_service_payment = await db.getRows({
		table: "user_service_payment",
		filter: {
			payment_receive__id: id,
			is_delete: 0,
		},
	});

	let sqlArray = [];
	let sqltmp;

	sqltmp = `
		UPDATE 
			payment_receive 
		SET 
			is_delete = 1
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		UPDATE
			user_service_payment
		SET
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE
			payment_receive__id = ${id}
			AND
			is_delete = 0
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		UPDATE
			due_pay
		SET
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE
			payment_receive__id = ${id}
			AND
			is_delete = 0
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			if (user_service_payment.length > 0) {
				for (element of user_service_payment) {
					await recalUserService(element.user_service__id);
				}
			}
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return false;
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "sql error",
			});
			return false;
		}
	} catch (err) {
		res.status(200).json({
			error: true,
			type: "error",
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return false;
	}
};

const returnList = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const returnView = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const returnGet = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const returnInsert = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const returnUpdate = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

const returnDelete = async (req, res, next) => {
	try {
		const rows = await db.getRows({
			table: "service",
			limit: 900,
		});
		res.status(200).json({
			error: false,
			type: "success",
			logout: false,
			msg: "Access granted",
			data: await rows,
		});
		return false;
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

module.exports = {
	receiveList,
	receiveGet,
	receiveView,
	receiveGetByUser,
	receiveInsert,
	receiveUpdate,
	receiveDelete,

	returnList,
	returnView,
	returnGet,
	returnInsert,
	returnUpdate,
	returnDelete,
};
