require("dotenv").config();
const db = require("./db.service.js");

const sendSms = async (to, msg) => {
	smsStatus = await fetch("https://xxxxsms.mram.com.bd/smsapi", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			api_key: "C30013226776889b109614.26725210",
			senderid: "PROVATi IT",
			type: "unicode",
			msg: msg,
			contacts: to,
		}),
	});
	// .then((ress) => ress.json())
	// .then((data) => {
	// 	console.log("Success:", data);
	// 	return data;
	// })
	// .catch((error) => {
	// 	console.error("Error:", error);
	// 	return error;
	// });

	const html = await smsStatus.text();

	if (parseInt(html.indexOf("SUBMITTED")) > 0) {
		return true;
	} else {
		return false;
	}
};

const sendSmsM2M = async (msgList) => {
	smsStatus = await fetch("https://xxxsms.mram.com.bd/smsapimanyps", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			api_key: "C30013226776889b109614.26725210",
			senderid: "PROVATi IT",
			type: "unicode",
			messages: msgList,
		}),
	});

	const html = await smsStatus.text();

	if (parseInt(html.indexOf("SUBMITTED")) > 0) {
		return true;
	} else {
		return false;
	}
};

module.exports = {
	sendSms,
	sendSmsM2M,
};
