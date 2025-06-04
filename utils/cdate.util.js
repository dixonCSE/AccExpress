const dateTime = require("date-and-time");

const cDateTime = () => {
	const now = new Date();
	return dateTime.format(now, "YYYY-MM-DD HH:mm:ss");
};

module.exports = {
	cDateTime,
};
