require("dotenv").config();

//const fs = require('fs');

//const env = process.env;

const db = {
	// ssl: {
	//   mode: 'VERIFY_IDENTITY',
	//   ca: fs.readFileSync('/etc/ssl/cert.pem', 'utf-8'),
	// },

	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	// password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	// port: process.env.DB_PORT,

	// waitForConnections: true,
	// connectionLimit: 200,
	// queueLimit: 6000,
	// debug: false,
	multipleStatements: true,
};

module.exports = db;
