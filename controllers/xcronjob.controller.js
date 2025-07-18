require("dotenv").config();

const datexTime = require("date-and-time");

const dateTime = require("../utils/cdate.util.js");
const nf = require("../utils/numberFormat.util.js");
const db = require("../services/db.service.js");
const sms = require("../services/sms.service.js");

const dueService = require("../services/due.service.js");
const advSrv = require("../services/adv.service.js");

const RemindSms = async (req, res, next) => {
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

		msgList = [];
		sqlArray = [];
		sqltmp;

		if (list.length > 0) {
			list.forEach(async (item, index) => {
				remindBefore = 2;
				xduration = Number(item.duration) - 1;
				rduration = xduration - remindBefore;

				price = nf.dec(item.price);

				adv = nf.dec(await advSrv.getBUser(item.user__id));
				totalOldDue = nf.dec(await dueService.getTotal(item.user__id));

				cadv = adv - price;
				cdue = totalOldDue + price - adv;
				if (adv > price) {
					cadv = adv - price;
					cdue = 0;
				} else {
					cadv = 0;
					cdue = totalOldDue + price - adv;
				}

				endDate = datexTime.format(
					datexTime.addDays(new Date(item.renewDate), xduration),
					"YYYY-MM-DD 23:59:59",
				);

				renewDate = datexTime.format(
					datexTime.addDays(new Date(item.renewDate), item.duration),
					"YYYY-MM-DD 00:00:00",
				);

				nextEndDate2 = datexTime.format(new Date(renewDate), "D MMM, YYYY");

				remindDate = datexTime.format(
					datexTime.addDays(new Date(item.renewDate), rduration),
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

							'auto renew',
							0,
							0,

							'${item.renew_date}',
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

				/* 
				msg = `
					Dear ${item.first_name},\n
					Your ${item.service__name} service has been successfully renewed.\n
					Next Renewal: ${nextEndDate2}\n\n
					Current Bill: ${price}\n
					Previous Advance: ${adv}\n
					Previous Due: ${totalOldDue}\n
					Current Advance: ${cadv}\n
					Current Due: ${cdue}\n\n
					Need help? Reply or call us. 01873200200\n
					PROVATi IT
				`; 
				*/

				msg = `Dear ${item.first_name},\nYour ${item.service__name} service has been successfully renewed.\nNext Renewal: ${nextEndDate2}\n\nCurrent Bill: ${price}\nPrevious Advance: ${adv}\nPrevious Due: ${totalOldDue}\nCurrent Advance: ${cadv}\nCurrent Due: ${cdue}\n\nNeed help? Reply or call us. 01873200200\nPROVATi IT`;

				to = item.phone;
				msgList.push({
					to: to,
					message: msg,
				});

				// smsRes = await sms.sendSms(to, msg);
			});

			//const sqlres = await db.trx(sqlArray);

			// if (sqlres) {
			if (true) {
				// smsRes = await sms.sendSmsM2M(msgList);

				res.status(200).json({
					error: false,
					type: "demo",
					msgList: msgList,
					sqlArray: sqlArray,
				});
				return true;

				if (smsRes == false) {
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
			msg: "Try Error",
			msgDev: err,
		});
		return true;
	}
};

module.exports = {
	RemindSms,
	Renew,
};
