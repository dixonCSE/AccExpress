require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mail = require("./services/mail.service");
const cronjob = require("./controllers/cronjob.controller");

const apiRoutes = require("./routes/api.route");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route");
const cronjobRouter = require("./routes/cronjob.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

global.myVar = "Hello from global!";

app.get("/", async (req, res) => {
	res.status(200).json({
		message: "accept authenticated.",
	});
});

app.post("/sms", async (req, res) => {
	console.log("Request POST:", req.body);
	res.status(200).json({
		message: "post accept",
		reqDta: req.body,
	});
});

app.get("/remind", cronjob.RemindSms);

app.get("/sms", async (req, res) => {
	X = await fetch("http://localhost:3000/sms", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ to: "01701", msg: "demo msg" }),
	})
		.then((ress) => ress.json())
		.then((data) => {
			return {
				message: "post accept get",
				resData: data,
			};
		})
		.catch((error) => {
			return {
				message: error,
			};
		});

	console.log(X);

	res.status(200).json(X);
});

app.get("/sendmail", async (req, res) => {
	const to = "dixonhalder7@gmail.com";
	const sub = "Test Email";
	const body =
		"<h1>Test Email</h1>" +
		"<p>This is a test email from the server.</p>" +
		"<p>Please do not reply to this email.</p>";
	const result = await mail.sendEmail(to, sub, body);
	res.status(200).json(result);
});

app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/cronjob", cronjobRouter);

const port = process.env.HTTP_PORT || 8080;

app.listen(port, () => {
	console.log(`App listening on port http://localhost:${port}`);
});
