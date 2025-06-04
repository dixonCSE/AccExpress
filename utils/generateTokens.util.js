require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateTokens = async (user) => {
	try {
		const payload = user;
		const accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: "7d",
		});
		const refreshToken = jwt.sign(
			payload,
			process.env.REFRESH_JWT_PRIVATE_KEY,
			{
				algorithm: "HS256",
				expiresIn: "30d",
			},
		);
		return Promise.resolve({ accessToken, refreshToken });
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports = generateTokens;
