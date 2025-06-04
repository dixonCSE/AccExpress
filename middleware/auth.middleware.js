require("dotenv").config();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const auth = async (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) {
		return res.status(403).json({
			error: true,
			type: "error",
			logout: true,
			msg: "Access Denied: No authorization token provided",
		});
	}

	try {
		let tokenJwt = token.split(" ");
		const tokenDetails = jwt.verify(tokenJwt[1], process.env.JWT_PRIVATE_KEY);
		req.user = tokenDetails;
		next();
	} catch (err) {
		res.status(403).json({
			error: true,
			type: "error",
			logout: true,
			msg: "Access Denied: Invalid authorization token",
		});
	}
};

const roleCheck = (role) => {
	return (req, res, next) => {
		let userRole = CryptoJS.AES.decrypt(
			req.user.role,
			process.env.SECURITY_PRIVATE_KEY,
		).toString(CryptoJS.enc.Utf8);

		if (role == userRole) {
			next();
		} else {
			res.status(403).json({
				error: true,
				type: "error",
				logout: false,
				mag: "Access Denied: Invalid role authorization token",
			});
		}
	};
};

module.exports = {
	auth,
	roleCheck,
};
