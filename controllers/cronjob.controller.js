require("dotenv").config();

const datexTime = require("date-and-time");

const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");
const db = require("../services/db.service.js");
const sms = require("../services/sms.service.js");

const dueService = require("../services/due.service.js");
const advSrv = require("../services/adv.service.js");

// hello check

const xRemindSms = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	const now = new Date();
	const sdate = datexTime.format(now, "YYYY-MM-DD 00:00:00");
	const edate = datexTime.format(now, "YYYY-MM-DD 23:59:59");
	try {
		const list = await db.query(
			`
				SELECT 
					\`t1\`.\`id\` AS \`id\`, 
					\`t1\`.\`user__id\` AS \`user__id\`, 
					\`t1\`.\`service__id\` AS \`service__id\`, 
					\`t1\`.\`renew_date\` AS \`renew_date\`, 
					\`t1\`.\`end_date\` AS \`end_date\`, 
					\`user\`.\`first_name\` AS \`first_name\`,
					\`user\`.\`phone\` AS \`phone\`,
					\`service\`.\`name\` AS \`service__name\`
				FROM 
					\`user_service\` AS \`t1\`
					LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`t1\`.\`service__id\`
					LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`t1\`.\`user__id\`
				WHERE
					\`t1\`.\`remind_date\` >= '${sdate}'
					AND 
					\`t1\`.\`remind_date\` <= '${edate}'
					AND 
					\`t1\`.\`is_remind\` = 1
					AND 
					\`t1\`.\`auto_renew\` = 1
					AND 
					\`t1\`.\`is_closed\` = 0
					AND 
					\`t1\`.\`is_delete\` = 0
					AND
					\`t1\`.\`service__id\` IN (SELECT \`id\` FROM \`service\` WHERE \`service_type__id\` = 3)
				LIMIT 0,99
			`,
			[],
		);
		let smsArray = [];
		msgList = [];
		let sqlArray = [];
		let sqltmp;

		if (list.length > 0) {
			list.forEach(async (item, index) => {
				to = item.phone;
				renewDate2 = datexTime.format(new Date(item.end_date), "D MMM, YYYY");

				/* renewDate2 = datexTime.format(
					datexTime.parse("2025-05-07 23:59:59", "YYYY-MM-DD HH:mm:ss"),
					"D MMM, YYYY",
				); */

				sqltmp = `
					UPDATE 
						\`user_service\` 
					SET 
						\`is_remind\` = 0
					WHERE 
						\`id\` = ${item.id}
					;
				`;
				sqlArray.push(sqltmp);

				/* 
				msg = `
					Dear ${item.first_name},\n \n
					Your ${item.service__name} service is set to expire on ${renewDate2}.\n
					To enjoy uninterrupted service, please renew before expiry.\n\n
					Need help? Reply or call us. 01873200200\n
					PROVATi IT
				`; 
				*/

				msg = `Dear ${item.first_name},\n \nYour ${item.service__name} service is set to expire on ${renewDate2}.\nTo enjoy uninterrupted service, please renew before expiry.\n\nNeed help? Reply or call us. 01873200200\nPROVATi IT`;

				msgList.push({
					to: to,
					message: msg,
				});

				smsRes = await sms.sendSms(to, msg);
				smsArray.push(msg);
			});

			// smsRes = await sms.sendSmsM2M(msgList);

			const sqlres = await db.trx(sqlArray);
			// sqlArray = [];

			if (sqlres) {
				res.status(200).json({
					error: false,
					type: "success",
					msg: "success",
					res: sqlres,
					list: list,
					sqlArray: sqlArray,
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
		}

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
			list: list,
		});
		return true;
	} catch (err) {
		console.log(err);
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return true;
	}
};

const RemindSms = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	const now = new Date();
	const sdate = datexTime.format(now, "YYYY-MM-DD 00:00:00");
	const edate = datexTime.format(now, "YYYY-MM-DD 23:59:59");
	sqlTmpArray = [];
	try {
		const list = await db.query(
			`
				SELECT 
					\`t1\`.\`id\` AS \`id\`, 
					\`t1\`.\`user__id\` AS \`user__id\`, 
					\`t1\`.\`service__id\` AS \`service__id\`, 
					\`t1\`.\`renew_date\` AS \`renew_date\`, 
					\`t1\`.\`end_date\` AS \`end_date\`, 
					\`user\`.\`first_name\` AS \`first_name\`,
					\`user\`.\`phone\` AS \`phone\`,
					\`service\`.\`name\` AS \`service__name\`
				FROM 
					\`user_service\` AS \`t1\`
					LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`t1\`.\`service__id\`
					LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`t1\`.\`user__id\`
				WHERE
					\`t1\`.\`remind_date\` >= '${sdate}'
					AND 
					\`t1\`.\`remind_date\` <= '${edate}'
					AND 
					\`t1\`.\`is_remind\` = 1
					AND 
					\`t1\`.\`auto_renew\` = 1
					AND 
					\`t1\`.\`is_closed\` = 0
					AND 
					\`t1\`.\`is_delete\` = 0
					AND
					\`t1\`.\`service__id\` IN (SELECT \`id\` FROM \`service\` WHERE \`service_type__id\` = 3)
				LIMIT 0,99
			`,
			[],
		);

		if (list.length > 0) {
			list.forEach(async (item, index) => {
				let sqlArray = [];
				let sqltmp;

				let to = item.phone;
				let renewDate2 = datexTime.format(
					new Date(item.end_date),
					"D MMM, YYYY",
				);

				sqltmp = `
					UPDATE 
						\`user_service\` 
					SET 
						\`is_remind\` = 0
					WHERE 
						\`id\` = ${item.id}
					;
				`;
				sqlArray.push(sqltmp);
				sqlTmpArray.push(sqltmp);

				/* 
				msg = `
					Dear ${item.first_name},\n \n
					Your ${item.service__name} service is set to expire on ${renewDate2}.\n
					To enjoy uninterrupted service, please renew before expiry.\n\n
					Need help? Reply or call us. 01873200200\n
					PROVATi IT
				`; 
				*/

				let sqlres = await db.trx(sqlArray);
				sqlArray = [];

				let msg = `Dear ${item.first_name},\n \nYour ${item.service__name} service is set to expire on ${renewDate2}.\nTo enjoy uninterrupted service, please renew before expiry.\n\nNeed help? Reply or call us. 01873200200\nPROVATi IT`;
				let smsRes = await sms.sendSms(to, msg);
			});

			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
				sqlArray: sqlTmpArray,
			});
			return true;
		} else {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "no data found",
			});
			return true;
		}
	} catch (err) {
		console.log(err);
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return true;
	}
};

const Renew = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	const now = new Date();
	const sdate = datexTime.format(now, "YYYY-MM-DD 00:00:00");
	const edate = datexTime.format(now, "YYYY-MM-DD 23:59:59");
	try {
		const list = await db.query(
			`
				SELECT 
					\`t1\`.*, 
					\`user\`.\`first_name\` AS \`first_name\`,
					\`user\`.\`phone\` AS \`phone\`,
					\`service\`.\`name\` AS \`service__name\`
				FROM 
					\`user_service\` AS \`t1\`
					LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`t1\`.\`service__id\`
					LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`t1\`.\`user__id\`
				WHERE
					\`t1\`.\`renew_date\` >= '${sdate}'
					AND 
					\`t1\`.\`renew_date\` <= '${edate}'
					AND 
					\`t1\`.\`auto_renew\` = 1
					AND 
					\`t1\`.\`is_closed\` = 0
					AND 
					\`t1\`.\`is_delete\` = 0
					AND
					\`t1\`.\`service__id\` IN (SELECT \`id\` FROM \`service\` WHERE \`service_type__id\` = 3)
				LIMIT 0,99
			`,
			[],
		);

		let remindBefore = 2;
		let msgList = [];
		// let sqlArray = [];
		// let sqltmp = null;

		if (list.length > 0) {
			list.forEach(async (item, index) => {
				let sqlArray = []; //
				let sqltmp = null; //

				let xduration = Number(item.duration) - 1;
				let rduration = xduration - remindBefore;

				let price = nf.dec(item.price);

				let adv = nf.dec(await advSrv.getBUser(item.user__id));
				let totalOldDue = nf.dec(await dueService.getTotal(item.user__id));

				let cadv = adv - price;
				let cdue = totalOldDue + price - adv;
				if (adv > price) {
					cadv = adv - price;
					cdue = 0;
				} else {
					cadv = 0;
					cdue = totalOldDue + price - adv;
				}

				let startDate = datexTime.format(
					new Date(item.renew_date),
					"YYYY-MM-DD 00:00:00",
				);

				let endDate = datexTime.format(
					datexTime.addDays(new Date(item.renew_date), xduration),
					"YYYY-MM-DD 23:59:59",
				);

				let renewDate = datexTime.format(
					datexTime.addDays(new Date(item.renew_date), item.duration),
					"YYYY-MM-DD 00:00:00",
				);

				let nextEndDate2 = datexTime.format(new Date(renewDate), "D MMM, YYYY");

				let remindDate = datexTime.format(
					datexTime.addDays(new Date(item.renew_date), rduration),
					"YYYY-MM-DD 23:59:59",
				);

				sqltmp = `
					UPDATE 
						\`user_service\` 
					SET 
						\`auto_renew\` = 0,
						\`is_closed\` = 1
					WHERE 
						\`id\` = ${item.id}
					;
				`;
				sqlArray.push(sqltmp);

				sqltmp = `
					INSERT INTO \`user_service\` (
						\`user__id\`,
						\`service__id\`,

						\`main_service__id\`,

						\`ori_price\`,
						\`buy_price\`,
						\`price\`,
						\`net\`,

						\`note\`,
						\`is_closed\`,
						\`is_boost\`,

						\`start_date\`,
						\`end_date\`,
						\`remind_date\`,
						\`renew_date\`,

						\`duration\`,
						\`auto_renew\`,

						\`created_date\`,
						\`updated_date\`
						) VALUES (
							${item.user__id},
							${item.service__id},
							
							${item.id},

							${item.ori_price},
							${item.buy_price},
							${item.price},
							${item.price},

							'auto renew',
							0,
							0,

							'${startDate}',
							'${endDate}',
							'${remindDate}',
							'${renewDate}',

							'${item.duration}',
							1,

							'${cdate}',
							'${cdate}'
						);
				`;
				sqlArray.push(sqltmp);

				// msg = `
				// 	Dear ${item.first_name},\n
				// 	Your ${item.service__name} service has been successfully renewed.\n
				// 	Next Renewal: ${nextEndDate2}\n\n
				// 	Current Bill: ${price}\n
				// 	Previous Advance: ${adv}\n
				// 	Previous Due: ${totalOldDue}\n
				// 	Current Advance: ${cadv}\n
				// 	Current Due: ${cdue}\n\n
				// 	Need help? Reply or call us. 01873200200\n
				// 	PROVATi IT
				// `;

				let msg = `Dear ${item.first_name},\nYour ${item.service__name} service has been successfully renewed.\nNext Renewal: ${nextEndDate2}\n\nCurrent Bill: ${price}\nPrevious Advance: ${adv}\nPrevious Due: ${totalOldDue}\nCurrent Advance: ${cadv}\nCurrent Due: ${cdue}\n\nNeed help? Reply or call us. 01873200200\nPROVATi IT`;

				let to = item.phone;
				msgList.push({
					to: to,
					message: msg,
				});

				// console.log(to);
				// console.log(msg);
				// console.log(sqlArray);
				// console.log(`-id-${item.id}-name -${item.service__name}-`);

				let sqlres = await db.trx(sqlArray);
				sqlArray = [];

				let smsRes = await sms.sendSms(to, msg);
			});

			//const sqlres = await db.trx(sqlArray);

			// if (sqlres) {
			if (true) {
				// smsRes = await sms.sendSmsM2M(msgList);

				// if (smsRes == false) {
				if (true) {
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
						msg: "msg not send",
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
		}

		let renewBillres = await pRenewBill();

		res.status(200).json({
			error: false,
			type: "success",
			msg: "Access granted",
		});
		return true;
	} catch (err) {
		console.log(err);
		res.status(200).json({
			error: true,
			type: "error",
			msg: "Try 2 Error",
			msgDev: err,
		});
		return true;
	}
};

const RenewBill = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	try {
		let sqlArray = []; //
		let sqltmp = null; //

		sqltmp = `
			INSERT INTO \`bill_get\`(
				\`bill__id\`,
				\`name\`,
				\`amount\`,
				\`status__id\`,

				\`start_date\`,
				\`end_date\`,
				\`duration\`,

				\`parent__id\`,

				\`auto_renew\`,
				\`renew_date\`,
				\`renew_amount\`,
				\`is_closed\`,

				\`created_date\`,
				\`updated_date\`
			)
			SELECT 
				\`t1\`.\`bill__id\` AS \`bill_id\`,
				\`t1\`.\`name\` AS \`bill_name\`,
				\`t1\`.\`renew_amount\` AS \`amount\`,
				\`t1\`.\`status__id\` AS \`status_id\`,

				\`t1\`.\`renew_date\` AS \`start_date\`,
				DATE_SUB(DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL \`t1\`.\`duration\` DAY), INTERVAL 1 SECOND) AS \`end_date\`,
				\`t1\`.\`duration\` AS \`duration\`,

				\`t1\`.\`id\` AS \`parent__id\`,

				1 AS \`auto_renew\`,
				DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL \`t1\`.\`duration\` DAY) AS \`renew_date\`,
				\`t1\`.\`renew_amount\` AS \`renew_amount\`,
				0 AS \`is_closed\`,

				'${cdate}' AS \`created_date\`,
				'${cdate}' AS \`updated_date\`
			FROM 
				\`bill_get\` AS \`t1\`
				LEFT JOIN
				\`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
			WHERE 
				\`t1\`.\`auto_renew\` = 1
				AND 
				\`t1\`.\`is_closed\` = 0
				AND 
				\`t1\`.\`renew_date\` <= '${cdate}'
				AND 
				\`bill\`.\`bill_type__id\` = 3
			;
		`;
		sqlArray.push(sqltmp);

		sqltmp = `
			UPDATE 
				\`bill_get\` 
			SET 
				\`auto_renew\` = 0,
				\`is_closed\` = 1
			WHERE 
				\`id\` IN (
					SELECT 
						\`t1\`.\`id\` AS \`id\`
					FROM 
						\`bill_get\` AS \`t1\`
						LEFT JOIN
						\`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
					WHERE 
						\`t1\`.\`auto_renew\` = 1
						AND 
						\`t1\`.\`is_closed\` = 0
						AND 
						\`t1\`.\`renew_date\` <= '${cdate}'
						AND 
						\`bill\`.\`bill_type__id\` = 3
				)
			;
		`;
		sqlArray.push(sqltmp);

		let sqlres = await db.trx(sqlArray);

		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: false,
				type: "error",
				msg: "sql error",
			});
			return true;
		}
	} catch (err) {
		// console.log(err);
		console.log(sqlArray);
		res.status(200).json({
			error: true,
			type: "error",
			msg: "Try 2 Error",
			msgDev: err,
		});
		return true;
	}
};

const pRenewBill = async () => {
	const cdate = dateTime.cDateTime();
	try {
		let sqlArray = []; //
		let sqltmp = null; //

		sqltmp = `
			INSERT INTO \`bill_get\`(
				\`bill__id\`,
				\`name\`,
				\`amount\`,
				\`status__id\`,

				\`start_date\`,
				\`end_date\`,
				\`duration\`,

				\`parent__id\`,

				\`auto_renew\`,
				\`renew_date\`,
				\`renew_amount\`,
				\`is_closed\`,

				\`created_date\`,
				\`updated_date\`
			)
			SELECT 
				\`t1\`.\`bill__id\` AS \`bill__id\`,
				\`t1\`.\`name\` AS \`bill_name\`,
				\`t1\`.\`renew_amount\` AS \`amount\`,
				\`t1\`.\`status__id\` AS \`status__id\`,

				\`t1\`.\`renew_date\` AS \`start_date\`,
				DATE_SUB(DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL \`t1\`.\`duration\` DAY), INTERVAL 1 SECOND) AS \`end_date\`,
				\`t1\`.\`duration\` AS \`duration\`,

				\`t1\`.\`id\` AS \`parent__id\`,

				1 AS \`auto_renew\`,
				DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL \`t1\`.\`duration\` DAY) AS \`renew_date\`,
				\`t1\`.\`renew_amount\` AS \`renew_amount\`,
				0 AS \`is_closed\`,

				'${cdate}' AS \`created_date\`,
				'${cdate}' AS \`updated_date\`
			FROM 
				\`bill_get\` AS \`t1\`
				LEFT JOIN
				\`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
			WHERE 
				\`t1\`.\`auto_renew\` = 1
				AND 
				\`t1\`.\`is_closed\` = 0
				AND 
				\`t1\`.\`renew_date\` <= '${cdate}'
				AND 
				\`bill\`.\`bill_type__id\` = 3
			;
		`;
		sqlArray.push(sqltmp);

		sqltmp = `
			UPDATE 
				\`bill_get\` 
			SET 
				\`auto_renew\` = 0,
				\`is_closed\` = 1
			WHERE 
				\`id\` IN (
					SELECT 
						\`t1\`.\`id\` AS \`id\`
					FROM 
						\`bill_get\` AS \`t1\`
						LEFT JOIN
						\`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
					WHERE 
						\`t1\`.\`auto_renew\` = 1
						AND 
						\`t1\`.\`is_closed\` = 0
						AND 
						\`t1\`.\`renew_date\` <= '${cdate}'
						AND 
						\`bill\`.\`bill_type__id\` = 3
				)
			;
		`;
		sqlArray.push(sqltmp);

		let sqlres = await db.trx(sqlArray);

		if (sqlres) {
			return true;
		} else {
			return true;
		}
	} catch (err) {
		console.log(err);
		return true;
	}
};

const RenewBillMonthly = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	try {
		let sqlArray = []; //
		let sqltmp = null; //

		sqltmp = `
			INSERT INTO \`bill_get\`(

				\`bill__id\`,
				\`name\`,
				\`amount\`,

				\`datestr\`,
				\`dateint\`,
				
				\`status__id\`,
				\`is_fixed\`,
				\`is_closed\`,
				\`is_onetime\`,
				\`set_amount\`,

				\`start_date\`,
				\`end_date\`,

				\`renew_date\`,
				\`auto_renew\`,
				\`renew_amount\`,
				\`remind_date\`,

				\`created_date\`,

				\`parent__id\`
			)
			SELECT 
				\`t1\`.\`bill__id\` AS \`bill_id\`,
				\`t1\`.\`name\` AS \`bill_name\`,
				\`t1\`.\`renew_amount\` AS \`amount\`,

				DATE_FORMAT(\`t1\`.\`renew_date\`, '%Y - %M') AS \`datestr\`,
				DATE_FORMAT(\`t1\`.\`renew_date\`, '%Y%m') AS \`dateint\`,

				\`t1\`.\`status__id\` AS \`status__id\`,
				\`t1\`.\`is_fixed\` AS \`is_fixed\`,
				\`t1\`.\`is_closed\` AS \`is_closed\`,
				\`t1\`.\`is_onetime\` AS \`is_onetime\`,
				\`t1\`.\`set_amount\` AS \`set_amount\`,

				\`t1\`.\`renew_date\` AS \`start_date\`,
				DATE_SUB(DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL 1 MONTH), INTERVAL 1 SECOND) AS \`end_date\`,
				
				DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL 1 MONTH) AS \`renew_date\`,
				1 AS \`auto_renew\`,
				\`t1\`.\`renew_amount\` AS \`renew_amount\`,
				DATE_SUB(DATE_ADD(\`t1\`.\`renew_date\`, INTERVAL 1 MONTH), INTERVAL 2 DAY) AS \`remind_date\`,

				'${cdate}' AS \`created_date\`,
				\`t1\`.\`id\` AS \`parent__id\`
			FROM 
				\`bill_get\` AS \`t1\`
				LEFT JOIN
				\`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
			WHERE 
				\`t1\`.\`auto_renew\` = 1
				AND 
				\`t1\`.\`is_closed\` = 0
				AND 
				\`t1\`.\`renew_date\` <= '${cdate}'
				AND 
				\`bill\`.\`bill_type__id\` = 1
			;
		`;
		sqlArray.push(sqltmp);

		sqltmp = `
			UPDATE 
				\`bill_get\` 
			SET 
				\`auto_renew\` = 0,
				\`is_closed\` = 1
			WHERE 
				\`id\` IN (
					SELECT 
						\`t1\`.\`id\` AS \`id\`
					FROM 
						\`bill_get\` AS \`t1\`
						LEFT JOIN
						\`bill\` AS \`bill\` ON \`bill\`.\`id\` = \`t1\`.\`bill__id\`
					WHERE 
						\`t1\`.\`auto_renew\` = 1
						AND 
						\`t1\`.\`is_closed\` = 0
						AND 
						\`t1\`.\`renew_date\` <= '${cdate}'
						AND 
						\`bill\`.\`bill_type__id\` = 1
				)
			;
		`;
		sqlArray.push(sqltmp);

		let sqlres = await db.trx(sqlArray);

		if (sqlres) {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: false,
				type: "error",
				msg: "sql error",
			});
			return true;
		}
	} catch (err) {
		// console.log(err);
		console.log(sqlArray);
		res.status(200).json({
			error: true,
			type: "error",
			msg: "Try 2 Error",
			msgDev: err,
		});
		return true;
	}
};

const EndBoostSms = async (req, res, next) => {
	const cdate = dateTime.cDateTime();
	const now = new Date();
	const sdate = datexTime.format(now, "YYYY-MM-DD HH:mm:ss");
	const eDate = datexTime.format(
		datexTime.addDays(new Date(sdate), -2),
		"YYYY-MM-DD HH:mm:ss",
	);
	sqlTmpArray = [];
	try {
		const list = await db.query(
			`
				SELECT 
					\`t1\`.\`id\` AS \`id\`, 
					\`t1\`.\`end_date\` AS \`end_date\`, 
					\`user\`.\`first_name\` AS \`first_name\`,
					\`user\`.\`phone\` AS \`phone\`,
					\`service\`.\`name\` AS \`service__name\`
				FROM 
					\`user_date_service\` AS \`t1\`
					LEFT JOIN \`user_service\` AS \`user_service\` ON \`user_service\`.\`id\` = \`t1\`.\`user_service__id\`
					LEFT JOIN \`service\` AS \`service\` ON \`service\`.\`id\` = \`user_service\`.\`service__id\`
					LEFT JOIN \`user\` AS \`user\` ON \`user\`.\`id\` = \`user_service\`.\`user__id\`
				WHERE
					\`t1\`.\`end_date\` <= '${sdate}'
					AND 
					\`t1\`.\`is_endsmssend\` = 0
					AND 
					\`t1\`.\`is_delete\` = 0
				LIMIT 0,99
			`,
			[],
		);

		if (list.length > 0) {
			list.forEach(async (item, index) => {
				let sqlArray = [];
				let sqltmp;

				let to = item.phone;
				// let to = "01711156085";
				let endDate2 = datexTime.format(
					new Date(item.end_date),
					"D MMM, YYYY hh:mm A",
				);

				sqltmp = `
					UPDATE 
						\`user_date_service\` 
					SET 
						\`is_endsmssend\` = 1
					WHERE 
						\`id\` = ${item.id}
					;
				`;
				sqlArray.push(sqltmp);

				/* 
				msg = `
					Your ${service__name} is successfully completed.\n
					at ${endDate2}.\n
					Stay tuned for the next update.\n
					Need help? Call: 01873200200
				`; 
				*/

				let sqlres = await db.trx(sqlArray);
				sqlArray = [];

				let msg = `Your ${item.service__name} is successfully completed.\nat ${endDate2}.\nStay tuned for the next update.\nNeed help? Call: 01873200200`;
				let smsRes = await sms.sendSms(to, msg);
			});

			res.status(200).json({
				error: false,
				type: "success",
				msg: "success",
			});
			return true;
		} else {
			res.status(200).json({
				error: false,
				type: "success",
				msg: "no data found",
			});
			return true;
		}
	} catch (err) {
		console.log(err);
		res.status(200).json({
			error: true,
			type: "error",
			msg: "SQL QUERY Error",
			msgDev: err,
		});
		return true;
	}
};

module.exports = {
	RemindSms,
	Renew,
	RenewBill,
	EndBoostSms,
	RenewBillMonthly,
};
