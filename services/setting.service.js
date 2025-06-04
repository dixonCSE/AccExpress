require("dotenv").config();
const CryptoJS = require("crypto-js");
const db = require("./db.service.js");
// const dateTime = require("../utils/cdate.util.js");

s = {};

const get = async () => {
	try {
		resultSettingList = await db.query(
			`
				SELECT 
					\`id\`, 
					\`key_code\`, 
					\`name\`, 
					\`type\`, 
					\`value\` 
				FROM 
					\`setting\` 
				WHERE 
					\`is_active\` = 1 
					AND 
					\`is_delete\` = 0
			`,
			[],
		);

		if (resultSettingList && resultSettingList.length > 0) {
			res = {};
			resultSettingList.forEach((ele1, idx1) => {
				if (ele1.type == "int") {
					vl = parseInt(ele1.value);
				} else if (ele1.type == "string") {
					vl = ele1.value.toString();
				} else if (ele1.type == "str") {
					vl = ele1.value.toString();
				} else if (ele1.type == "float") {
					vl = parseFloat(ele1.value);
				} else if (ele1.type == "encrypt") {
					vl = CryptoJS.AES.decrypt(
						ele1.value,
						process.env.SECURITY_PRIVATE_KEY,
					).toString(CryptoJS.enc.Utf8);
				} else if (ele1.type == "array") {
					vl = ele1.value
						.toString()
						.split(",")
						.map((x) => x.toString());
				} else if (ele1.type == "array_int") {
					vl = ele1.value
						.toString()
						.split(",")
						.map((x) => parseInt(x));
				} else if (ele1.type == "array_float") {
					vl = ele1.value
						.toString()
						.split(",")
						.map((x) => parseFloat(x));
				} else {
					vl = ele1.value.toString();
				}
				res[ele1.key_code] = vl;
			});
			s = res;
			return res;
		} else {
			s = {};
			return false;
		}
	} catch (err) {
		return false;
	}
};

const getx = async () => {
	if (Object.keys(s).length > 0) {
		return s;
	} else {
		return get();
	}
};

module.exports = {
	get,
	getx,
};
