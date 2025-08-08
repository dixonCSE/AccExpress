require("dotenv").config();
const fs = require("fs");
const path = require("path");
const datexTime = require("date-and-time");

const nf = require("../utils/numberFormat.util.js");
const helper = require("../utils/dbHelper.util.js");
const dateTime = require("../utils/cdate.util.js");

const dueService = require("../services/due.service.js");
const sms = require("../services/sms.service.js");
const advSrv = require("../services/adv.service.js");
const db = require("../services/db.service.js");

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
		user__id: `\`t1\`.\`user__id\``,
		service__id: `\`t1\`.\`service__id\``,
		service_type__id: `\`service_type\`.\`id\``,
	};

	searchStr = "";
	if (search) {
		searchStr = `
			( 
				\`t2\`.\`name\` LIKE '%${search}%' 
				OR 
				\`t3\`.\`user_name\` LIKE '%${search}%' 
				OR 
				\`t3\`.\`phone\` LIKE '%${search}%' 
			) 
			AND 
		`;
	}

	filterStr = "";
	if (filter) {
		// filter = JSON.parse(filter);
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
				\`t1\`.\`user__id\` AS \`user__id\`, 
				\`t1\`.\`service__id\` AS \`service__id\`, 
				\`t1\`.\`wallet__id\` AS \`wallet__id\`, 
				\`t1\`.\`bank__id\` AS \`bank__id\`, 
				\`t1\`.\`price\` AS \`price\`, 
				\`t1\`.\`discount\` AS \`discount\`, 
				\`t1\`.\`net\` AS \`net\`, 
				\`t1\`.\`payment\` AS \`payment\`, 
				\`t1\`.\`due\` AS \`due\`, 
				\`t1\`.\`is_install\` AS \`is_install\`, 
				\`t1\`.\`is_install_active\` AS \`is_install_active\`, 
				\`t1\`.\`auto_renew\` AS \`auto_renew\`, 
				\`t1\`.\`is_closed\` AS \`is_closed\`, 
				\`t1\`.\`created_date\` AS \`created_date\`,

				\`service_type\`.\`id\` AS \`service_type__id\`, 
				\`t2\`.\`name\` AS \`service__name\`, 
				\`t2\`.\`image\` AS \`service__image\`, 
				\`t3\`.\`user_name\` AS \`user__user_name\`, 
				\`t3\`.\`first_name\` AS \`user__first_name\`, 
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
				\`user_service\` AS \`t1\` 
				LEFT JOIN \`service\` AS \`t2\` ON \`t2\`.\`id\` = \`t1\`.\`service__id\` 
				LEFT JOIN \`service_type\` AS \`service_type\` ON \`service_type\`.\`id\` = \`t2\`.\`service_type__id\` 
				LEFT JOIN \`user\` AS \`t3\` ON \`t3\`.\`id\` = \`t1\`.\`user__id\` 
				LEFT JOIN \`bank\` AS \`t4\` ON \`t4\`.\`id\` = \`t1\`.\`bank__id\` 
				LEFT JOIN \`wallet\` AS \`t5\` ON \`t5\`.\`id\` = \`t1\`.\`wallet__id\`
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
			msg: "Access granted2",
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
	const rows = await db.getRow({
		table: "user_service",
		filter: req.params.id,
	});

	try {
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
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const Get = async (req, res, next) => {
	const rows = await db.getRow({
		table: "user_service",
		filter: req.params.id,
	});

	try {
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
			msg: "db transaction try error",
			dev: sqlArray,
			dev2: err,
		});
		return true;
	}
};

const Gets = async (req, res, next) => {
	try {
		const sqlRes = await db.getRows({
			table: "user_service",
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

	// res.status(200).json({
	// 	error: true,
	// 	type: "error",
	// 	msg: validationMsg ? validationMsg : "data validation error",
	// 	data: req.body,
	// });
	// return false;

	if (validation) {
		if (
			req.body.user__id === undefined ||
			req.body.user__id == "" ||
			req.body.user__id === null
		) {
			validation = false;
			validationMsg = "User required";
			validationData.push({
				field: "user",
				msg: validationMsg,
			});
		} else {
			user__id = parseInt(req.body.user__id);
		}
	}

	if (validation) {
		if (user__id === undefined || isNaN(user__id) || user__id < 1) {
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
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			t2 = false;
		} else {
			t2 = true;
			bank__id = parseInt(req.body.bank__id);
		}
	}

	if (validation && t2) {
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation && t2) {
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

	if (validation) {
		if (
			req.body.service__id == undefined ||
			req.body.service__id == "" ||
			req.body.service__id === null
		) {
			validation = false;
			validationMsg = "Sevice required";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		} else {
			service__id = parseInt(req.body.service__id);
		}
	}

	if (validation) {
		if (service__id == undefined || isNaN(service__id) || service__id < 1) {
			validation = false;
			validationMsg = "Service is not valid";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowService = await db.getRow({
			table: "service",
			filter: service__id,
		});

		if (rowService == false) {
			validation = false;
			validationMsg = "Service is not found";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}
	//

	if (validation) {
		if (
			req.body.payment === undefined ||
			req.body.payment == "" ||
			req.body.payment === null
		) {
			if (t2) {
				validation = false;
				validationMsg = "Service payment required";
				validationData.push({
					field: "payment",
					msg: validationMsg,
				});
			} else {
				payment = 0;
			}
		} else {
			payment = nf.dec(req.body.payment);
		}
	}

	if (validation) {
		if (payment === undefined || isNaN(payment) || payment < 0) {
			validation = false;
			validationMsg = "Service payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			if (payment <= 0.1) {
				t2 = false;
			}
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
	////

	if (validation) {
		if (
			req.body.buyAmount === undefined ||
			req.body.buyAmount == "" ||
			req.body.buyAmount === null
		) {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = nf.dec(req.body.buyAmount);
		}
	}

	if (validation) {
		if (buyAmount === undefined || isNaN(buyAmount) || buyAmount < 0) {
			validation = false;
			validationMsg = "Service Buy Price is not valid";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (buyAmount < 0) {
			validation = false;
			validationMsg = "Service Buy Price < 0";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		}
	}
	/////

	if (validation) {
		if (
			req.body.saleAmount === undefined ||
			req.body.saleAmount == "" ||
			req.body.saleAmount === null
		) {
			validation = false;
			validationMsg = "Service Sale Price required";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = nf.dec(req.body.saleAmount);
		}
	}

	if (validation) {
		if (saleAmount === undefined || isNaN(saleAmount) || saleAmount < 0) {
			validation = false;
			validationMsg = "Service Sale Price is not valid";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		}
	}
	/////

	if (validation) {
		if (
			req.body.discount === undefined ||
			req.body.discount == "" ||
			req.body.discount === null
		) {
			discount = 0;
		} else {
			discount = nf.dec(req.body.discount);
		}
	}

	if (validation) {
		if (discount === undefined || isNaN(discount) || discount < 0) {
			validation = false;
			validationMsg = "Service discount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.isSms === undefined ||
			req.body.isSms == "" ||
			req.body.isSms === null
		) {
			isSms = false;
		} else {
			isSms = !!req.body.isSms;
		}
	}

	if (validation) {
		if (
			req.body.note === undefined ||
			req.body.note == "" ||
			req.body.note === null
		) {
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

	avd = nf.dec(await advSrv.getBUser(user__id));
	oldDue = nf.dec(await dueService.getOld(user__id));
	totalOldDue = nf.dec(await dueService.getTotal(user__id));

	let sqlArray = [];
	let sqltmp;

	let net = nf.dec(saleAmount - discount);
	let due = nf.dec(net - payment);

	let tmpPayment = nf.dec(payment + avd);
	let tmpRest = tmpPayment;
	if (net <= tmpRest) {
		tmpRest = nf.dec(tmpRest - net);
		tmp1 = net;
	} else {
		tmp1 = tmpRest;
		tmpRest = 0;
	}

	sqltmp = `
		INSERT INTO \`user_service\` (
			\`user__id\`,
			\`service__id\`,

			\`ori_price\`,
			\`buy_price\`,
			\`price\`,
			\`discount\`,
			\`net\`,
			\`payment\`,
			\`due\`,

			\`note\`,

			\`is_install\`,
			\`is_closed\`,

			\`start_date\`,
			\`end_date\`,

			\`created_date\`,
			\`updated_date\`
			) VALUES (
				${user__id},
				${service__id},

				${rowService.price},
				${buyAmount},
				${saleAmount},
				${discount},
				${net},
				${tmp1},
				${due},

				${note},

				${rowService.is_install},
				0,

				'${cdate}',
				'${cdate}',

				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	if (tmpPayment > 0) {
		if (payment > 0 && t2) {
			sqltmp = `
				INSERT INTO \`payment_receive\` (
					\`user__id\`,
					\`service__id\`,
					\`user_service__id\`,
					\`bank__id\`,
					\`wallet__id\`,
					\`payment\`,
					\`trxid\`,

					\`table_name\`,
					\`row__id\`,

					\`payment_date\`,
					\`created_date\`,
					\`updated_date\`
					) VALUES ( 
						${user__id},
						${service__id},
						@liid,
						${bank__id},
						11,
						${payment},
						${trxid},

						'user_service',
						@liid,

						'${cdate}',
						'${cdate}',
						'${cdate}'
					);
			`;
			sqlArray.push(sqltmp);

			sqltmp = "SET @pr_liid = LAST_INSERT_ID();";
			sqlArray.push(sqltmp);

			pr_liid = `@pr_liid`;
		} else {
			pr_liid = `null`;
		}

		sqltmp = `
			INSERT INTO \`user_service_payment\` (
				\`user_service__id\`,
				\`amount\`,

				\`payment_receive__id\`,
				\`created_date\`,
				\`updated_date\`
				) 
				VALUES 
				(
					@liid,
					${tmp1},

					${pr_liid},
					'${cdate}',
					'${cdate}'
				);
		`;
		sqlArray.push(sqltmp);

		///////////////////////////////////////////////////////

		if (oldDue > 0 && tmpRest > 0) {
			if (tmpRest > oldDue) {
				tmpRest = nf.dec(tmpRest - oldDue);
				tmpAmount = oldDue;
			} else {
				tmpRest = 0;
				tmpAmount = tmpRest;
			}

			sqltmp = `
				INSERT INTO 
					\`due_pay\` 
					(
						\`user__id\`,\`
						\`\`amount\`,
						\`payment_receive__id\`,
						\`created_date\`,
						\`updated_date\`
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

		if (tmpRest > 0) {
			rowsUserService = await db.getRows({
				table: "user_service",
				filter: {
					user__id: user__id,
					"due >": 0,
					is_delete: 0,
				},
			});

			if (rowsUserService.length > 0) {
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
							Update 
								\`user_service\` 
							SET 
								\`payment\` = ${tmpPayment},
								\`due\` = ${tmpDue},
								\`updated_date\` = '${cdate}'
							WHERE 
								\`id\` = ${eId}
							;
						`;
						sqlArray.push(sqltmp);

						sqltmp = `
							INSERT INTO \`user_service_payment\` (
								\`user_service__id\`,
								\`amount\`,
	
								\`payment_receive__id\`,
								\`created_date\`,
								\`updated_date\`
								) 
								VALUES 
								(
									${eId},
									${duePayment},
	
									${pr_liid},
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
			}
		}

		///////////////////////////////////////////////////////
	}

	try {
		const sqlres = await db.trx(sqlArray);

		if (sqlres) {
			if (isSms) {
				let cdue = nf.dec(await dueService.getTotal(user__id));
				let cavd = nf.dec(await advSrv.getBUser(user__id));
				let totalPayable = nf.dec(net + totalOldDue - avd);

				let to = rowUser.phone;
				/* 
				msg = `
					Dear ${rowUser.first_name},\n
					Thanks for using our ${rowService.name} Service.\n\n
					Order Summary:\n
					Sub Total: ${saleAmount}\n
					Discount: ${discount}\n
					Net: ${net}\n
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

				msg = `Dear ${rowUser.first_name},\nThanks for using our ${rowService.name} Service.\n\nOrder Summary:\nSub Total: ${saleAmount}\nDiscount: ${discount}\nNet: ${net}\nPrevious Due: ${totalOldDue}\nAdvance: ${avd}\nTotal Payable:${totalPayable}\nAmount Paid: ${payment}\nCurrent Due: ${cdue}\nCurrent Advance: ${cavd}\n\nNeed help? Just reply or call us.\nPROVATi IT`;

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
		return false;
	}
};

const userServiceByUser = async (req, res, next) => {
	try {
		const sqlRes = await db.query(
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
				t1.created_date AS created_date,

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

const userServiceGet = async (req, res, next) => {
	try {
		const sqlRes = await db.getRow({
			table: "user_service",
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

const userServiceInsert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	// res.status(200).json({
	// 	error: true,
	// 	type: "error",
	// 	msg: validationMsg ? validationMsg : "data validation error",
	// 	data: req.body,
	// });
	// return false;

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
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			t2 = false;
		} else {
			t2 = true;
			bank__id = req.body.bank__id;
		}
	}

	if (validation && t2) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation && t2) {
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

	if (validation) {
		if (req.body.service__id == undefined || req.body.service__id == "") {
			validation = false;
			validationMsg = "Sevice required";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		} else {
			service__id = req.body.service__id;
		}
	}

	if (validation) {
		service__id = parseInt(service__id);
		if (service__id == undefined || isNaN(service__id) || service__id < 1) {
			validation = false;
			validationMsg = "Service is not valid";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowService = await db.getRow({
			table: "service",
			filter: service__id,
		});

		if (rowService == false) {
			validation = false;
			validationMsg = "Service is not found";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}
	//

	if (validation) {
		if (
			req.body.payment === undefined ||
			req.body.payment == "" ||
			req.body.payment === null
		) {
			if (t2) {
				validation = false;
				validationMsg = "Service payment required";
				validationData.push({
					field: "payment",
					msg: validationMsg,
				});
			} else {
				payment = 0;
			}
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment === undefined || isNaN(payment) || payment < 0) {
			validation = false;
			validationMsg = "Service payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
			if (payment <= 0.1) {
				t2 = false;
			}
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
	////

	if (validation) {
		if (req.body.buyAmount === undefined || req.body.buyAmount === "") {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = req.body.buyAmount;
		}
	}

	if (validation) {
		buyAmount = parseFloat(buyAmount);
		if (buyAmount == undefined || isNaN(buyAmount)) {
			validation = false;
			validationMsg = "Service Buy Price is not valid";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = nf.dec(buyAmount);
		}
	}

	if (validation) {
		if (buyAmount < 0) {
			validation = false;
			validationMsg = "Service Buy Price < 0";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		}
	}
	/////

	if (validation) {
		if (req.body.saleAmount == undefined || req.body.saleAmount == "") {
			validation = false;
			validationMsg = "Service Sale Price required";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = req.body.saleAmount;
		}
	}

	if (validation) {
		saleAmount = parseFloat(saleAmount);
		if (saleAmount == undefined || isNaN(saleAmount)) {
			validation = false;
			validationMsg = "Service Sale Price is not valid";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = nf.dec(saleAmount);
		}
	}

	if (validation) {
		if (saleAmount < 0) {
			validation = false;
			validationMsg = "Service Sale Price < 0";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		}
	}
	/////

	if (validation) {
		if (req.body.discount == undefined || req.body.discount == "") {
			discount = 0;
		} else {
			discount = req.body.discount;
		}
	}

	if (validation) {
		discount = parseFloat(discount);
		if (discount == undefined || isNaN(discount)) {
			validation = false;
			validationMsg = "Service discount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = nf.dec(discount);
		}
	}

	if (validation) {
		if (discount < 0) {
			validation = false;
			validationMsg = "Service discount < 0";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.isSms == undefined || req.body.endDate == "") {
			isSms = false;
		} else {
			isSms = !!req.body.isSms;
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

	avd = nf.dec(await advSrv.getBUser(user__id));
	oldDue = nf.dec(await dueService.getOld(user__id));
	totalOldDue = nf.dec(await dueService.getTotal(user__id));

	let sqlArray = [];
	let sqltmp;

	let net = nf.dec(saleAmount - discount);
	let due = nf.dec(net - payment);

	let tmpPayment = nf.dec(payment + avd);
	let tmpRest = tmpPayment;
	if (net <= tmpRest) {
		tmpRest = nf.dec(tmpRest - net);
		tmp1 = net;
	} else {
		tmp1 = tmpRest;
		tmpRest = 0;
	}

	sqltmp = `
		INSERT INTO user_service (
			user__id,
			service__id,

			ori_price,
			buy_price,
			price,
			discount,
			net,
			payment,
			due,

			note,

			is_install,
			is_closed,

			start_date,
			end_date,

			created_date,
			updated_date
			) VALUES (
				${user__id},
				${service__id},

				${rowService.price},
				${buyAmount},
				${saleAmount},
				${discount},
				${net},
				${tmp1},
				${due},

				${note},

				${rowService.is_install},
				0,

				'${cdate}',
				'${cdate}',

				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	if (tmpPayment > 0) {
		if (payment > 0 && t2) {
			sqltmp = `
				INSERT INTO \`payment_receive\` (
					\`user__id\`,
					\`service__id\`,
					\`user_service__id\`,
					\`bank__id\`,
					\`wallet__id\`,
					\`payment\`,
					\`trxid\`,

					\`table_name\`,
					\`row__id\`,

					\`payment_date\`,
					\`created_date\`,
					\`updated_date\`
					) VALUES ( 
						${user__id},
						${service__id},
						@liid,
						${bank__id},
						11,
						${payment},
						${trxid},

						'user_service',
						@liid,

						'${cdate}',
						'${cdate}',
						'${cdate}'
					);
			`;
			sqlArray.push(sqltmp);

			sqltmp = "SET @pr_liid = LAST_INSERT_ID();";
			sqlArray.push(sqltmp);

			pr_liid = `@pr_liid`;
		} else {
			pr_liid = `null`;
		}

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
					@liid,
					${tmp1},

					${pr_liid},
					'${cdate}',
					'${cdate}'
				);
		`;
		sqlArray.push(sqltmp);

		///////////////////////////////////////////////////////

		if (oldDue > 0 && tmpRest > 0) {
			if (tmpRest > oldDue) {
				tmpRest = nf.dec(tmpRest - oldDue);
				tmpAmount = oldDue;
			} else {
				tmpRest = 0;
				tmpAmount = tmpRest;
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

		if (tmpRest > 0) {
			rowsUserService = await db.getRows({
				table: "user_service",
				filter: {
					user__id: user__id,
					"due >": 0,
					is_delete: 0,
				},
			});

			if (rowsUserService.length > 0) {
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
	
									${pr_liid},
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
			}
		}

		///////////////////////////////////////////////////////
	}

	try {
		const sqlres = await db.trx(sqlArray);

		if (sqlres) {
			if (isSms) {
				let cdue = nf.dec(await dueService.getTotal(user__id));
				let cavd = nf.dec(await advSrv.getBUser(user__id));
				let totalPayable = nf.dec(net + totalOldDue - avd);

				let to = rowUser.phone;
				/* 
				msg = `
					Dear ${rowUser.first_name},\n
					Thanks for using our ${rowService.name} Service.\n\n
					Order Summary:\n
					Sub Total: ${saleAmount}\n
					Discount: ${discount}\n
					Net: ${net}\n
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

				msg = `Dear ${rowUser.first_name},\nThanks for using our ${rowService.name} Service.\n\nOrder Summary:\nSub Total: ${saleAmount}\nDiscount: ${discount}\nNet: ${net}\nPrevious Due: ${totalOldDue}\nAdvance: ${avd}\nTotal Payable:${totalPayable}\nAmount Paid: ${payment}\nCurrent Due: ${cdue}\nCurrent Advance: ${cavd}\n\nNeed help? Just reply or call us.\nPROVATi IT`;

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
		return false;
	}
};

const userBoostServiceInsert = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	// res.status(200).json({
	// 	error: true,
	// 	type: "error",
	// 	msg: validationMsg ? validationMsg : "data validation error",
	// 	data: req.body,
	// });

	// endDate = datexTime.format(new Date(req.body.endDate), "YYYY-MM-DD HH:mm:ss");
	// endDate2 = datexTime.format(new Date(req.body.endDate), "YYYY-MM-DD");
	// endTime = datexTime.format(new Date(req.body.endTime), "HH:mm:ss");
	// req.body.tt = endDate2 + " " + endTime;

	// console.log(req.body);
	// return false;

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
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			t2 = false;
		} else {
			t2 = true;
			bank__id = req.body.bank__id;
		}
	}

	if (validation && t2) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation && t2) {
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

	if (validation) {
		if (req.body.service__id == undefined || req.body.service__id == "") {
			validation = false;
			validationMsg = "Sevice required";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		} else {
			service__id = req.body.service__id;
		}
	}

	if (validation) {
		service__id = parseInt(service__id);
		if (service__id == undefined || isNaN(service__id) || service__id < 1) {
			validation = false;
			validationMsg = "Service is not valid";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowService = await db.getRow({
			table: "service",
			filter: service__id,
		});

		if (rowService == false) {
			validation = false;
			validationMsg = "Service is not found";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.payment === undefined ||
			req.body.payment == "" ||
			req.body.payment === null
		) {
			if (t2) {
				validation = false;
				validationMsg = "Service payment required";
				validationData.push({
					field: "payment",
					msg: validationMsg,
				});
			} else {
				payment = 0;
			}
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment === undefined || isNaN(payment) || payment < 0) {
			validation = false;
			validationMsg = "Service payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
			if (payment <= 0.1) {
				t2 = false;
			}
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
		if (req.body.saleRate === undefined || req.body.saleRate === "") {
			validation = false;
			validationMsg = "Currency sale Price required";
			validationData.push({
				field: "saleRate",
				msg: validationMsg,
			});
		} else {
			saleRate = req.body.saleRate;
		}
	}

	if (validation) {
		saleRate = parseFloat(saleRate);
		if (saleRate == undefined || isNaN(saleRate)) {
			validation = false;
			validationMsg = "Currency Sale Price is not valid";
			validationData.push({
				field: "saleRate",
				msg: validationMsg,
			});
		} else {
			saleRate = nf.dec(saleRate);
		}
	}

	if (validation) {
		if (saleRate < 0) {
			validation = false;
			validationMsg = "Currency sale Price < 0";
			validationData.push({
				field: "saleRate",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.useAmount === undefined || req.body.useAmount === "") {
			validation = false;
			validationMsg = "Currency user required";
			validationData.push({
				field: "useAmount",
				msg: validationMsg,
			});
		} else {
			useAmount = req.body.useAmount;
		}
	}

	if (validation) {
		useAmount = parseFloat(useAmount);
		if (useAmount == undefined || isNaN(useAmount)) {
			validation = false;
			validationMsg = "Currency use valid";
			validationData.push({
				field: "useAmount",
				msg: validationMsg,
			});
		} else {
			useAmount = nf.dec(useAmount);
		}
	}

	if (validation) {
		if (useAmount < 0) {
			validation = false;
			validationMsg = "Currency use < 0";
			validationData.push({
				field: "useAmount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.buyRate === undefined || req.body.buyRate === "") {
			validation = false;
			validationMsg = "Currency Buy Price required";
			validationData.push({
				field: "buyRate",
				msg: validationMsg,
			});
		} else {
			buyRate = req.body.buyRate;
		}
	}

	if (validation) {
		buyRate = parseFloat(buyRate);
		if (buyRate == undefined || isNaN(buyRate)) {
			validation = false;
			validationMsg = "Currency Buy Price is not valid";
			validationData.push({
				field: "buyRate",
				msg: validationMsg,
			});
		} else {
			buyRate = nf.dec(buyRate);
		}
	}

	if (validation) {
		if (buyRate < 0) {
			validation = false;
			validationMsg = "Dollar Buy Price < 0";
			validationData.push({
				field: "buyRate",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.discount == undefined || req.body.discount == "") {
			discount = 0;
		} else {
			discount = req.body.discount;
		}
	}

	if (validation) {
		discount = parseFloat(discount);
		if (discount == undefined || isNaN(discount)) {
			validation = false;
			validationMsg = "Service discount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = nf.dec(discount);
		}
	}

	if (validation) {
		if (discount < 0) {
			validation = false;
			validationMsg = "Service discount < 0";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.startDate == undefined || req.body.startDate == "") {
			validation = false;
			validationMsg = "Start Date required";
			validationData.push({
				field: "startDate",
				msg: validationMsg,
			});
		} else {
			startDatex = datexTime.format(
				new Date(req.body.startDate),
				"YYYY-MM-DD HH:mm:ss",
			);
			startDate = datexTime.format(new Date(req.body.startDate), "YYYY-MM-DD");
			startDate2 = datexTime.format(new Date(req.body.startDate), "YYYY-MM-DD");
			startDate3 = datexTime.format(new Date(req.body.startDate), "DD MMM, YY");
		}
	}

	if (validation) {
		if (req.body.startTime == undefined || req.body.startTime == "") {
			validation = false;
			validationMsg = "End Time required";
			validationData.push({
				field: "startTime",
				msg: validationMsg,
			});
		} else {
			startTime = datexTime.format(new Date(req.body.startTime), "HH:mm:ss");

			startDate = startDate2 + " " + startTime;
		}
	}

	if (validation) {
		if (req.body.endDate == undefined || req.body.endDate == "") {
			validation = false;
			validationMsg = "End Date required";
			validationData.push({
				field: "endDate",
				msg: validationMsg,
			});
		} else {
			// endDate = datexTime.format(
			// 	new Date(req.body.endDate),
			// 	"YYYY-MM-DD HH:mm:ss",
			// );
			endDate = datexTime.format(new Date(req.body.endDate), "YYYY-MM-DD");
			endDate2 = datexTime.format(new Date(req.body.endDate), "YYYY-MM-DD");
			endDate3 = datexTime.format(new Date(req.body.endDate), "DD MMM, YY");
		}
	}

	if (validation) {
		if (req.body.endTime == undefined || req.body.endTime == "") {
			validation = false;
			validationMsg = "End Time required";
			validationData.push({
				field: "endTime",
				msg: validationMsg,
			});
		} else {
			endTime = datexTime.format(new Date(req.body.endTime), "HH:mm:ss");
			endDate = endDate2 + " " + endTime;
		}
	}

	if (validation) {
		if (req.body.isSms == undefined || req.body.isSms == "") {
			isSms = false;
		} else {
			isSms = !!req.body.isSms;
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

	avd = nf.dec(await advSrv.getBUser(user__id));
	oldDue = nf.dec(await dueService.getOld(user__id));
	totalOldDue = nf.dec(await dueService.getTotal(user__id));

	saletotal = nf.dec(useAmount * saleRate);
	buytotal = nf.dec(useAmount * buyRate);

	let sqlArray = [];
	let sqltmp;

	let net = nf.dec(saletotal - discount);
	let due = nf.dec(net - payment);

	let tmpPayment = nf.dec(payment + avd);
	let tmpRest = tmpPayment;
	if (net <= tmpRest) {
		tmpRest = nf.dec(tmpRest - net);
		tmp1 = net;
	} else {
		tmp1 = tmpRest;
		tmpRest = 0;
	}

	const objStr = JSON.stringify({
		currency_buy_price: buyRate,
		currency_sale_price: saleRate,
		currency_amount: useAmount,
		total: saletotal,
		start_date: startDate,
		end_date: endDate,
	});

	sqltmp = `
		INSERT INTO user_service (
			user__id,
			service__id,

			ori_price,
			buy_price,
			price,
			discount,
			net,
			payment,
			due,

			note,

			is_install,
			is_closed,
			is_boost,

			start_date,
			end_date,

			type_detail,

			created_date,
			updated_date
			) VALUES (
				${user__id},
				${service__id},

				${buytotal},
				${buytotal},
				${saletotal},
				${discount},
				${net},
				${tmp1},
				${due},

				${note},

				${rowService.is_install},
				0,
				1,

				'${startDate}',
				'${endDate}',

				'${objStr}',

				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	let date1 = new Date(endDate);
	let date2 = new Date();
	is_endsmssend = 1;
	if (date1 < date2) {
		is_endsmssend = 1;
	} else if (date1 > date2) {
		is_endsmssend = 0;
	} else {
		is_endsmssend = 1;
	}

	sqltmp = `
		INSERT INTO user_date_service (
			user_service__id,

			currency_buy_price,
			currency_sale_price,
			currency_amount,
			total,

			start_date,
			end_date,
			is_endsmssend,

			created_date,
			updated_date
			) VALUES (
				@liid,

				${buyRate},
				${saleRate},
				${useAmount},
				${saletotal},

				'${startDate}',
				'${endDate}',
				${is_endsmssend},

				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	if (tmpPayment > 0) {
		if (payment > 0 && t2) {
			sqltmp = `
				INSERT INTO payment_receive (
					user__id,
					service__id,
					user_service__id,
					bank__id,
					wallet__id,
					payment,
					trxid,

					table_name,
					row__id,

					payment_date,
					created_date,
					updated_date
					) VALUES ( 
						${user__id},
						${service__id},
						@liid,
						${bank__id},
						11,
						${payment},
						${trxid},

						'user_service',
						@liid,

						'${cdate}',
						'${cdate}',
						'${cdate}'
					);
			`;
			sqlArray.push(sqltmp);

			sqltmp = "SET @pr_liid = LAST_INSERT_ID();";
			sqlArray.push(sqltmp);

			pr_liid = `@pr_liid`;
		} else {
			pr_liid = `null`;
		}

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
					@liid,
					${tmp1},

					${pr_liid},
					'${cdate}',
					'${cdate}'
				);
		`;
		sqlArray.push(sqltmp);

		///////////////////////////////////////////////////////

		if (oldDue > 0 && tmpRest > 0) {
			if (tmpRest > oldDue) {
				tmpRest = tmpRest - oldDue;
				tmpAmount = oldDue;
			} else {
				tmpRest = 0;
				tmpAmount = tmpRest;
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

		if (tmpRest > 0) {
			rowsUserService = await db.getRows({
				table: "user_service",
				filter: {
					user__id: user__id,
					"due >": 0,
					is_delete: 0,
				},
			});

			if (rowsUserService.length > 0) {
				rowsUserService.forEach((element) => {
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
		
										${pr_liid},
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
			}
		}

		///////////////////////////////////////////////////////
	}

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			if (isSms) {
				let cdue = nf.dec(await dueService.getTotal(user__id));
				let cavd = nf.dec(await advSrv.getBUser(user__id));
				totalPayable = nf.dec(net + totalOldDue - avd);

				to = rowUser.phone;
				/* 
				msg = `
					Dear ${rowUser.first_name},\n
					Thanks for using our ${rowService.name} Service.\n
					Period: ${startDate2} ${endDate2}\n
					Use ad Credit: $${useAmount}\n
					Unit Price: ${saleRate}\n
					Sub Total: ${saletotal}\n
					Discount: ${discount}\n
					Net: ${net}\n
					Previous Due: ${totalOldDue}\n
					Advance: ${avd}\n
					Total Payable:${totalPayable}\n
					Amount Paid: ${payment}\n
					Current Due: ${cdue}\n
					Current Advance: ${cavd}\n\n
					Need help? Just reply or call us.\n
					PROVATi IT
				`;

				msg2 = `
					Dear ${rowUser.first_name},\n
					Thanks for using our ${rowService.name} Service.\n
					Period: ${startDate2} \n
					Use ad Credit: $${useAmount}\n
					Unit Price: ${saleRate}\n
					Sub Total: ${saletotal}\n
					Discount: ${discount}\n
					Net: ${net}\n
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

				if (startDate3 == endDate3) {
					msg = `Dear ${rowUser.first_name},\nThanks for using our ${rowService.name} Service.\nPeriod: ${startDate3} \nUse ad Credit: $${useAmount}\nUnit Price: ${saleRate}\nSub Total: ${saletotal}\nDiscount: ${discount}\nNet: ${net}\nPrevious Due: ${totalOldDue}\nAdvance: ${avd}\nTotal Payable:${totalPayable}\nAmount Paid: ${payment}\nCurrent Due: ${cdue}\nCurrent Advance: ${cavd}\n\nNeed help? Just reply or call us.\nPROVATi IT`;
				} else {
					msg = `Dear ${rowUser.first_name},\nThanks for using our ${rowService.name} Service.\nPeriod: ${startDate3} - ${endDate3}\nUse ad Credit: $${useAmount}\nUnit Price: ${saleRate}\nSub Total: ${saletotal}\nDiscount: ${discount}\nNet: ${net}\nPrevious Due: ${totalOldDue}\nAdvance: ${avd}\nTotal Payable:${totalPayable}\nAmount Paid: ${payment}\nCurrent Due: ${cdue}\nCurrent Advance: ${cavd}\n\nNeed help? Just reply or call us.\nPROVATi IT`;
				}
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

const userDurationServiceInsert = async (req, res, next) => {
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
		if (
			req.body.bank__id === undefined ||
			req.body.bank__id == "" ||
			req.body.bank__id === null
		) {
			t2 = false;
		} else {
			t2 = true;
			bank__id = req.body.bank__id;
		}
	}

	if (validation && t2) {
		bank__id = parseInt(bank__id);
		if (bank__id === undefined || isNaN(bank__id) || bank__id < 1) {
			validation = false;
			validationMsg = "Bank is not valid";
			validationData.push({
				field: "bank",
				msg: validationMsg,
			});
		}
	}

	if (validation && t2) {
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

	if (validation) {
		if (req.body.service__id == undefined || req.body.service__id == "") {
			validation = false;
			validationMsg = "Sevice required";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		} else {
			service__id = req.body.service__id;
		}
	}

	if (validation) {
		service__id = parseInt(service__id);
		if (service__id == undefined || isNaN(service__id) || service__id < 1) {
			validation = false;
			validationMsg = "Service is not valid";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowService = await db.getRow({
			table: "service",
			filter: service__id,
		});

		if (rowService == false) {
			validation = false;
			validationMsg = "Service is not found";
			validationData.push({
				field: "service",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (
			req.body.payment === undefined ||
			req.body.payment == "" ||
			req.body.payment === null
		) {
			if (t2) {
				validation = false;
				validationMsg = "Service payment required";
				validationData.push({
					field: "payment",
					msg: validationMsg,
				});
			} else {
				payment = 0;
			}
		} else {
			payment = req.body.payment;
		}
	}

	if (validation) {
		payment = parseFloat(payment);
		if (payment === undefined || isNaN(payment) || payment < 0) {
			validation = false;
			validationMsg = "Service payment is not valid";
			validationData.push({
				field: "payment",
				msg: validationMsg,
			});
		} else {
			payment = nf.dec(payment);
			if (payment <= 0.1) {
				t2 = false;
			}
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
		if (req.body.buyAmount === undefined || req.body.buyAmount === "") {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = req.body.buyAmount;
		}
	}

	if (validation) {
		buyAmount = parseFloat(buyAmount);
		if (buyAmount == undefined || isNaN(buyAmount)) {
			validation = false;
			validationMsg = "Service Buy Price is not valid";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = nf.dec(buyAmount);
		}
	}

	if (validation) {
		if (buyAmount < 0) {
			validation = false;
			validationMsg = "Service Buy Price < 0";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.saleAmount == undefined || req.body.saleAmount == "") {
			validation = false;
			validationMsg = "Service Sale Price required";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = req.body.saleAmount;
		}
	}

	if (validation) {
		saleAmount = parseFloat(saleAmount);
		if (saleAmount == undefined || isNaN(saleAmount)) {
			validation = false;
			validationMsg = "Service Sale Price is not valid";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = nf.dec(saleAmount);
		}
	}

	if (validation) {
		if (saleAmount < 0) {
			validation = false;
			validationMsg = "Service Sale Price < 0";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.discount == undefined || req.body.discount == "") {
			discount = 0;
		} else {
			discount = req.body.discount;
		}
	}

	if (validation) {
		discount = parseFloat(discount);
		if (discount == undefined || isNaN(discount)) {
			validation = false;
			validationMsg = "Service discount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = nf.dec(discount);
		}
	}

	if (validation) {
		if (discount < 0) {
			validation = false;
			validationMsg = "Service discount < 0";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.startDate == undefined || req.body.startDate == "") {
			validation = false;
			validationMsg = "Start Date required";
			validationData.push({
				field: "startDate",
				msg: validationMsg,
			});
		} else {
			startDate = datexTime.format(
				new Date(req.body.startDate),
				"YYYY-MM-DD HH:mm:ss",
			);
			startDate2 = datexTime.format(new Date(req.body.startDate), "YYYY-MM-DD");
		}
	}

	if (validation) {
		if (req.body.duration == undefined || req.body.duration == "") {
			validation = false;
			validationMsg = "duration required";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		} else {
			duration = req.body.duration;
		}
	}

	if (validation) {
		duration = parseInt(duration);
		if (duration == undefined || isNaN(duration)) {
			validation = false;
			validationMsg = "Service duration is not valid";
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		minDuration = 1;
		if (duration < minDuration) {
			validation = false;
			validationMsg = `Service duration minimum ${minDuration} days`;
			validationData.push({
				field: "duration",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.isSms == undefined || req.body.isSms == "") {
			isSms = false;
		} else {
			isSms = !!req.body.isSms;
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
	remindBefore = 2;
	xduration = duration - 1;
	rduration = xduration - remindBefore;
	endDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), xduration),
		"YYYY-MM-DD 23:59:59",
	);
	endDate2 = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), xduration),
		"YYYY-MM-DD",
	);

	remindDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), rduration),
		"YYYY-MM-DD 23:59:59",
	);
	renewDate = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), duration),
		"YYYY-MM-DD 00:00:00",
	);
	renewDate2 = datexTime.format(
		datexTime.addDays(new Date(req.body.startDate), duration),
		"YYYY-MM-DD",
	);

	avd = nf.dec(await advSrv.getBUser(user__id));
	oldDue = nf.dec(await dueService.getOld(user__id));
	totalOldDue = nf.dec(await dueService.getTotal(user__id));

	let sqlArray = [];
	let sqltmp;

	let net = nf.dec(saleAmount - discount);
	let due = nf.dec(net - payment);

	let tmpPayment = nf.dec(payment + avd);
	let tmpRest = tmpPayment;
	if (net <= tmpRest) {
		tmpRest = nf.dec(tmpRest - net);
		tmp1 = net;
	} else {
		tmp1 = tmpRest;
		tmpRest = 0;
	}

	sqltmp = `
		INSERT INTO user_service (
			user__id,
			service__id,

			ori_price,
			buy_price,
			price,
			discount,
			net,
			payment,
			due,

			note,
			is_closed,
			is_boost,

			start_date,
			end_date,
			remind_date,
			renew_date,

			duration,
			auto_renew,

			created_date,
			updated_date
			) VALUES (
				${user__id},
				${service__id},

				${rowService.price},
				${buyAmount},
				${saleAmount},
				${discount},
				${net},
				${tmp1},
				${due},

				${note},
				0,
				0,

				'${startDate}',
				'${endDate}',
				'${remindDate}',
				'${renewDate}',

				'${duration}',
				1,

				'${cdate}',
				'${cdate}'
			);
	`;
	sqlArray.push(sqltmp);

	sqltmp = "SET @liid = LAST_INSERT_ID();";
	sqlArray.push(sqltmp);

	if (tmpPayment > 0) {
		if (payment > 0 && t2) {
			sqltmp = `
				INSERT INTO payment_receive (
					user__id,
					service__id,
					user_service__id,
					bank__id,
					wallet__id,
					payment,
					trxid,

					table_name,
					row__id,

					payment_date,
					created_date,
					updated_date
					) VALUES ( 
						${user__id},
						${service__id},
						@liid,
						${bank__id},
						11,
						${payment},
						${trxid},

						'user_service',
						@liid,

						'${cdate}',
						'${cdate}',
						'${cdate}'
					);
			`;
			sqlArray.push(sqltmp);

			sqltmp = "SET @pr_liid = LAST_INSERT_ID();";
			sqlArray.push(sqltmp);

			pr_liid = `@pr_liid`;
		} else {
			pr_liid = `null`;
		}

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
					@liid,
					${tmp1},

					${pr_liid},
					'${cdate}',
					'${cdate}'
				);
		`;
		sqlArray.push(sqltmp);

		///////////////////////////////////////////////////////

		if (oldDue > 0 && tmpRest > 0) {
			if (tmpRest > oldDue) {
				tmpRest = tmpRest - oldDue;
				tmpAmount = oldDue;
			} else {
				tmpRest = 0;
				tmpAmount = tmpRest;
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

		if (tmpRest > 0) {
			rowsUserService = await db.getRows({
				table: "user_service",
				filter: {
					user__id: user__id,
					"due >": 0,
					is_delete: 0,
				},
			});

			if (rowsUserService.length > 0) {
				rowsUserService.forEach((element) => {
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
	
									${pr_liid},
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
			}
		}

		///////////////////////////////////////////////////////
	}

	try {
		const sqlres = await db.trx(sqlArray);
		if (sqlres) {
			if (isSms) {
				let cdue = nf.dec(await dueService.getTotal(user__id));
				let cavd = nf.dec(await advSrv.getBUser(user__id));
				to = rowUser.phone;
				// to = "01711156085";

				totalPayable = nf.dec(net + totalOldDue - avd);

				/* msg = `
					Dear ${rowUser.first_name},\n
					Your ${rowService.name} service has been successfully activated.\n\n
					Order Summary:\n
					Sub Total: ${saleAmount}\n
					Discount: ${discount}\n
					Net:${net}\n
					Previous Due: ${totalOldDue}\n
					Advance: ${avd}\n
					Total Payable:${totalPayable}\n
					Amount Paid: ${payment}\n
					Current Due: ${cdue}\n
					Current Advance: ${cavd}\n
					Next Renewal: ${renewDate2}\n\n
					Need help? Just reply or call us.\n
					PROVATi IT
				`; */

				msg = `Dear ${rowUser.first_name},\nYour ${rowService.name} service has been successfully activated.\n\nOrder Summary:\nSub Total: ${saleAmount}\nDiscount: ${discount}\nNet:${net}\nPrevious Due: ${totalOldDue}\nAdvance: ${avd}\nTotal Payable:${totalPayable}\nAmount Paid: ${payment}\nCurrent Due: ${cdue}\nCurrent Advance: ${cavd}\nNext Renewal: ${renewDate2}\n\nNeed help? Just reply or call us.\nPROVATi IT`;
				smsRes = await sms.sendSms(to, msg);
				//smsRes = true;
				if (smsRes == true) {
					res.status(200).json({
						error: false,
						type: "success",
						msg: "success",
						sms: msg,
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
			} else {
				res.status(200).json({
					error: false,
					type: "success",
					msg: "success",
				});
				return true;
			}
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

const userServiceClose = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	/* res.status(200).json({
		error: true,
		type: "error",
		msg: req.params,
	});
	return true; */

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "User Service ID required";
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
			validationMsg = "User Service ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "user_service",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "User Service ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.params.issms == undefined || req.params.issms == "") {
			validation = false;
			validationMsg = "Is Sms required";
			validationData.push({
				field: "issms",
				msg: validationMsg,
			});
		} else {
			issms = req.params.issms;
		}
	}

	if (validation) {
		issms = parseInt(issms);
		if (id == undefined || isNaN(issms)) {
			validation = false;
			validationMsg = "Is Sms is not valid";
			validationData.push({
				field: "issms",
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
		Update 
			user_service 
		SET 
			auto_renew = 0,
			is_closed = 1,
			updated_date = '${cdate}'
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	try {
		const sqlData = await db.query(
			`
				SELECT 
					\`user\`.\`first_name\` AS \`first_name\`, 
					\`user\`.\`phone\` AS \`phone\`, 
					\`service\`.\`name\` AS \`service\`
				FROM 
					\`user_service\` AS \`t1\`
					LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`t1\`.\`service__id\` 
					LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`t1\`.\`user__id\` 
				WHERE
					t1.id = ${id}
				LIMIT 0,1
			`,
			[],
		);
		const sqlRes = await db.trx(sqlArray);
		if (sqlRes) {
			if (issms == 1) {
				let to = sqlData[0].phone;
				/* 
				msg = `
					Dear ${sqlData[0].first_name},\n
					Your ${sqlData[0].service} has been closed.\n
					Thank you for choosing us.\n
					Need help or want to restart?\n
					Call 01873200200\n
					PROVATi IT
				`;
				*/

				msg = `Dear ${sqlData[0].first_name},\nYour ${sqlData[0].service} has been closed.\nThank you for choosing us.\nNeed help or want to restart?\nCall 01873200200\nPROVATi IT`;

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

const userServiceUpdate = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.id == undefined || req.body.id == "") {
			validation = false;
			validationMsg = "User Service ID required";
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
			validationMsg = "User Service ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "user_service",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "User Service ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			// TotalPaymentReceive = await db.query(
			// 	`
			// 		SELECT
			// 			IFNULL(SUM(payment), 0) AS payment
			// 		FROM
			// 			payment_receive
			// 		WHERE
			// 			user_service__id = ?
			// 			AND
			// 			is_delete = 0
			// 	`,
			// 	[row.id],
			// )[0].payment;
			// paymentReceive = await db.query(
			// 	`
			// 		SELECT
			// 			*
			// 		FROM
			// 			payment_receive
			// 		WHERE
			// 			user_service__id = ?
			// 			AND
			// 			is_delete = 0
			// 		ORDER BY id ASC
			// 		LIMIT 0, 1
			// 	`,
			// 	[row.id],
			// )[0];
		}
	}

	if (validation) {
		if (req.body.user__id == undefined || req.body.user__id == "") {
			validation = false;
			validationMsg = "User required";
			validationData.push({
				field: "user__id",
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
				field: "user__id",
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
			validationMsg = "Customer is not found";
			validationData.push({
				field: "user__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.service__id == undefined || req.body.service__id == "") {
			validation = false;
			validationMsg = "Sevice required";
			validationData.push({
				field: "service__id",
				msg: validationMsg,
			});
		} else {
			service__id = req.body.service__id;
		}
	}

	if (validation) {
		service__id = parseInt(service__id);
		if (service__id == undefined || isNaN(service__id) || service__id < 1) {
			validation = false;
			validationMsg = "Service is not valid";
			validationData.push({
				field: "service__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowService = await db.getRow({
			table: "service",
			filter: service__id,
		});

		if (rowService == false) {
			validation = false;
			validationMsg = "Service is not found";
			validationData.push({
				field: "service__id",
				msg: validationMsg,
			});
		}
	}
	////

	if (validation) {
		if (req.body.buyAmount === undefined || req.body.buyAmount === "") {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = req.body.buyAmount;
		}
	}

	if (validation) {
		buyAmount = parseFloat(buyAmount);
		if (buyAmount == undefined || isNaN(buyAmount)) {
			validation = false;
			validationMsg = "Service Buy Price is not valid";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = nf.dec(buyAmount);
		}
	}

	if (validation) {
		if (buyAmount < 0) {
			validation = false;
			validationMsg = "Service Buy Price < 0";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		}
	}
	/////

	if (validation) {
		if (req.body.saleAmount == undefined || req.body.saleAmount == "") {
			validation = false;
			validationMsg = "Service Sale Price required";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = req.body.saleAmount;
		}
	}

	if (validation) {
		saleAmount = parseFloat(saleAmount);
		if (saleAmount == undefined || isNaN(saleAmount)) {
			validation = false;
			validationMsg = "Service Sale Price is not valid";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = nf.dec(saleAmount);
		}
	}

	if (validation) {
		if (saleAmount < 0) {
			validation = false;
			validationMsg = "Service Sale Price < 0";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		}
	}
	///
	if (validation) {
		if (req.body.discount === undefined || req.body.discount === "") {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = req.body.discount;
		}
	}

	if (validation) {
		discount = parseFloat(discount);
		if (discount == undefined || isNaN(discount)) {
			validation = false;
			validationMsg = "Service discount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = nf.dec(discount);
		}
	}

	if (validation) {
		if (discount < 0) {
			validation = false;
			validationMsg = "Service discount < 0";
			validationData.push({
				field: "discount",
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

	let sqlArray = [];
	let sqltmp;
	let net = nf.dec(saleAmount - discount);

	sqltmp = `
		UPDATE 
			\`user_service\` 
		SET 
			\`user__id\` = ${user__id},
			\`service__id\` = ${service__id},

			\`buy_price\` = ${buyAmount},
			\`price\` = ${saleAmount},
			\`discount\` = ${discount},
			\`net\` = ${net},

			\`note\` = ${note},

			\`updated_date\` = '${cdate}'
		WHERE 
			\`id\` = ${row.id}
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
			recalUserService(row.id);
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

const userBoostServiceUpdate = async (req, res, next) => {
	const cdate = dateTime.cDateTime();

	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.body.id == undefined || req.body.id == "") {
			validation = false;
			validationMsg = "User Service ID required";
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
			validationMsg = "User Service ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "user_service",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "User Service ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		} else {
			//
		}
	}

	if (validation) {
		if (req.body.user__id == undefined || req.body.user__id == "") {
			validation = false;
			validationMsg = "User required";
			validationData.push({
				field: "user__id",
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
				field: "user__id",
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
			validationMsg = "Customer is not found";
			validationData.push({
				field: "user__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.body.service__id == undefined || req.body.service__id == "") {
			validation = false;
			validationMsg = "Sevice required";
			validationData.push({
				field: "service__id",
				msg: validationMsg,
			});
		} else {
			service__id = req.body.service__id;
		}
	}

	if (validation) {
		service__id = parseInt(service__id);
		if (service__id == undefined || isNaN(service__id) || service__id < 1) {
			validation = false;
			validationMsg = "Service is not valid";
			validationData.push({
				field: "service__id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		rowService = await db.getRow({
			table: "service",
			filter: service__id,
		});

		if (rowService == false) {
			validation = false;
			validationMsg = "Service is not found";
			validationData.push({
				field: "service__id",
				msg: validationMsg,
			});
		}
	}
	////

	if (validation) {
		if (req.body.buyAmount === undefined || req.body.buyAmount === "") {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = req.body.buyAmount;
		}
	}

	if (validation) {
		buyAmount = parseFloat(buyAmount);
		if (buyAmount == undefined || isNaN(buyAmount)) {
			validation = false;
			validationMsg = "Service Buy Price is not valid";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		} else {
			buyAmount = nf.dec(buyAmount);
		}
	}

	if (validation) {
		if (buyAmount < 0) {
			validation = false;
			validationMsg = "Service Buy Price < 0";
			validationData.push({
				field: "buyAmount",
				msg: validationMsg,
			});
		}
	}
	/////

	if (validation) {
		if (req.body.saleAmount == undefined || req.body.saleAmount == "") {
			validation = false;
			validationMsg = "Service Sale Price required";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = req.body.saleAmount;
		}
	}

	if (validation) {
		saleAmount = parseFloat(saleAmount);
		if (saleAmount == undefined || isNaN(saleAmount)) {
			validation = false;
			validationMsg = "Service Sale Price is not valid";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		} else {
			saleAmount = nf.dec(saleAmount);
		}
	}

	if (validation) {
		if (saleAmount < 0) {
			validation = false;
			validationMsg = "Service Sale Price < 0";
			validationData.push({
				field: "saleAmount",
				msg: validationMsg,
			});
		}
	}
	///
	if (validation) {
		if (req.body.discount === undefined || req.body.discount === "") {
			validation = false;
			validationMsg = "Service Buy Price required";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = req.body.discount;
		}
	}

	if (validation) {
		discount = parseFloat(discount);
		if (discount == undefined || isNaN(discount)) {
			validation = false;
			validationMsg = "Service discount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = nf.dec(discount);
		}
	}

	if (validation) {
		if (discount < 0) {
			validation = false;
			validationMsg = "Service discount < 0";
			validationData.push({
				field: "discount",
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

	let sqlArray = [];
	let sqltmp;
	let net = nf.dec(saleAmount - discount);

	sqltmp = `
		UPDATE 
			\`user_service\` 
		SET 
			\`user__id\` = ${user__id},
			\`service__id\` = ${service__id},

			\`buy_price\` = ${buyAmount},
			\`price\` = ${saleAmount},
			\`discount\` = ${discount},
			\`net\` = ${net},

			\`note\` = ${note},

			\`updated_date\` = '${cdate}'
		WHERE 
			\`id\` = ${row.id}
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
			recalUserService(row.id);
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

const boostClose = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "User Service ID required";
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
			validationMsg = "User Service ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		user_service = await db.getRow({
			table: "user_service",
			filter: id,
		});

		if (user_service == false) {
			validation = false;
			validationMsg = "User Service ID is not found";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.params.amt == undefined || req.params.amt == "") {
			validation = false;
			validationMsg = "Use amount required";
			validationData.push({
				field: "amt",
				msg: validationMsg,
			});
		} else {
			amt = nf.dec(req.params.amt);
		}
	}

	if (validation) {
		if (amt == undefined || isNaN(amt) || amt < 0.1) {
			validation = false;
			validationMsg = "Use amount is not valid";
			validationData.push({
				field: "amt",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.params.discount == undefined || req.params.discount == "") {
			validation = false;
			validationMsg = "Use amount required";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		} else {
			discount = nf.dec(req.params.discount);
		}
	}

	if (validation) {
		if (discount == undefined || isNaN(discount) || discount < 0) {
			validation = false;
			validationMsg = "Use amount is not valid";
			validationData.push({
				field: "discount",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		if (req.params.issms == undefined || req.params.issms == "") {
			validation = false;
			validationMsg = "Is Sms required";
			validationData.push({
				field: "issms",
				msg: validationMsg,
			});
		} else {
			issms = req.params.issms;
		}
	}

	if (validation) {
		issms = parseInt(issms);
		if (id == undefined || isNaN(issms)) {
			validation = false;
			validationMsg = "Is Sms is not valid";
			validationData.push({
				field: "issms",
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

	try {
		/* user = await db.getRow({
			table: "user",
			filter: user_service.user__id,
		});
		service = await db.getRow({
			table: "service",
			filter: user_service.service__id,
		}); */

		const user_date_service = await db.query(
			`
				SELECT 
					*
				FROM 
					\`user_date_service\`
				WHERE 
					\`user_date_service\`.\`user_service__id\` = ${id}
				LIMIT 0, 1
			`,
			[],
		);

		if (user_date_service.length > 0) {
			price = user_date_service[0].currency_sale_price;

			currency_amount = amt;
			totalAmount = nf.dec(currency_amount * price);
			ramt = nf.dec(user_date_service[0].currency_amount - currency_amount);

			log1 = JSON.stringify(user_date_service[0]);

			sqltmp = `
				UPDATE 
					\`user_date_service\` 
				SET 
					\`currency_amount\` = ${currency_amount},
					\`total\` = ${totalAmount},
					\`end_date\` = '${cdate}',
					\`updated_date\` = '${cdate}',
					\`is_endsmssend\` = 1,
					\`log\` = '${log1}'
				WHERE 
					\`id\` = ${user_date_service[0].id}
				;
			`;
			sqlArray.push(sqltmp);

			net = nf.dec(totalAmount - discount);
			log2 = JSON.stringify(user_service);
			sqltmp = `
				UPDATE 
					\`user_service\` 
				SET 
					\`price\` = ${totalAmount},
					\`net\` = ${net},
					\`discount\` = ${discount},
					\`is_closed\` = 1,
					\`end_date\` = '${cdate}',
					\`updated_date\` = '${cdate}',
					\`status__id\` = 2,
					\`log\` = '${log2}'
				WHERE 
					\`id\` = ${id}
				;
			`;
			sqlArray.push(sqltmp);

			const sqlData = await db.query(
				`
					SELECT 
						\`user\`.\`first_name\` AS \`first_name\`, 
						\`user\`.\`phone\` AS \`phone\`, 
						\`service\`.\`name\` AS \`service\`
					FROM 
						\`user_service\` AS \`t1\`
						LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`t1\`.\`service__id\` 
						LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`t1\`.\`user__id\` 
					WHERE
						t1.id = ${id}
					LIMIT 0,1
				`,
				[],
			);
			const sqlRes = await db.trx(sqlArray);
			if (sqlRes) {
				if (issms == 1) {
					let to = sqlData[0].phone;

					let cdue = nf.dec(await dueService.getTotal(user__id));
					let cavd = nf.dec(await advSrv.getBUser(user__id));

					/* msg = `
						Dear ${sqlData[0].first_name}, your ${sqlData[0].service} has been stopped as requested\n\n
						Budget $${user_date_service[0].currency_amount} USD\n
						Spent $${currency_amount} USD\n
						Remaining $${ramt} USD\n\n
						This amount has been adjusted from your due or added as advance\n
						Current Due ${cdue} BDT\n
						Advance Balance ${cavd} BDT\n\n
						Need help call 01873200200\n 
						PROVATi IT
					`; */

					let msg = `Dear ${sqlData[0].first_name}, your ${sqlData[0].service} has been stopped as requested\n\nBudget $${user_date_service[0].currency_amount} USD\nSpent $${currency_amount} USD\nRemaining $${ramt} USD\n\nThis amount has been adjusted from your due or added as advance\nCurrent Due ${cdue} BDT\nAdvance Balance ${cavd} BDT\n\nNeed help call 01873200200\nPROVATi IT`;
					smsRes = await sms.sendSms(to, msg);
					// smsRes = true;
					if (smsRes == true) {
						res.status(200).json({
							error: false,
							type: "success",
							msg: "success",
							msg2: msg,
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
					msg: "sql error",
				});
				return true;
			}
		} else {
			res.status(200).json({
				error: true,
				type: "error",
				msg: "user date service not found",
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

const userServiceView = async (req, res, next) => {
	// const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "user Service ID required";
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
		if (id == undefined || isNaN(id) || id > 0) {
			validation = false;
			validationMsg = "User Service ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "user_service",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "User Service ID is not found";
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

	try {
		const sqlRes = await db.query(
			`
				SELECT 
					t1.id AS id, 
					t1.user__id AS user__id, 
					t1.name AS name, 
				
					t1.price AS price, 
					t1.discount AS discount, 
					t1.net AS net, 
					t1.due AS due, 
					t1.payment AS payment, 
					t1.created_date AS created_date,

					t3.user_name AS user__user_name,
					t3.image AS user__image,
					t3.phone AS user__phone,

					t1.name AS service__name,
					t1.price AS service__price,
					t1.des AS service__des,
				FROM 
					user_service AS t1
					LEFT JOIN service AS t2 ON t2.id = t1.service__id
					LEFT JOIN user AS t3 ON t3.id = t1.user__id
				WHERE
				WHERE
					id = ${id} 
					AND
					is_delete = 0
				LIMIT 0, 1
			`,
			[],
		);

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
			data: sqlRes[0] || false,
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

const userServiceDelete = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	/////////////////////////////////////////////// begin validation ///////////////////////////////////////////////
	validation = true;
	validationData = [];
	validationMsg = false;

	if (validation) {
		if (req.params.id == undefined || req.params.id == "") {
			validation = false;
			validationMsg = "User Service ID required";
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
			validationMsg = "User Service ID is not valid";
			validationData.push({
				field: "id",
				msg: validationMsg,
			});
		}
	}

	if (validation) {
		row = await db.getRow({
			table: "user_service",
			filter: id,
		});

		if (row == false) {
			validation = false;
			validationMsg = "User Service ID is not found";
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
		Update 
			user_service 
		SET 
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE 
			id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		Update 
			payment_receive 
		SET 
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE 
			user_service__id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		Update 
			user_service_payment 
		SET 
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE 
			user_service__id = ${id}
		;
	`;
	sqlArray.push(sqltmp);

	sqltmp = `
		Update 
			user_date_service 
		SET 
			is_delete = 1,
			updated_date = '${cdate}'
		WHERE 
			user_service__id = ${id}
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
			payment_receive__id IN (
				SELECT 
					id 
				FROM 
					payment_receive 
				WHERE 
					user_service__id = ${id}
			)
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
	Table,
	Get,
	Gets,
	View,
	Insert,
	boostClose,
	userServiceByUser,
	userServiceView,
	userServiceGet,
	userServiceInsert,
	userServiceUpdate,
	userServiceDelete,
	userBoostServiceInsert,
	userBoostServiceUpdate,
	userDurationServiceInsert,
	userServiceClose,
};
