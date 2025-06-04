require("dotenv").config();
const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");

const sendEmail = async (to, subject, body) => {
	let transporter = nodemailer.createTransport(mailConfig);

	let info = await transporter.sendMail({
		from: mailConfig.auth.user, // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		// text: body, // plain text body
		html: body, // html body
	});

	if (info) {
		return {
			error: false,
			message: "email send, id:" + info.messageId,
		};
	} else {
		return {
			error: true,
			message: "email not send",
		};
	}
};

module.exports = {
	sendEmail,
};
