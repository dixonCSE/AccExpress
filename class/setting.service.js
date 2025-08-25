class SettingService {
	constructor() {
		this.data = {};

		this.data["theme"] = "light"; // default theme
		this.data["language"] = "en"; // default language
		console.log("constructor called SettingService");
	}

	set(key, value) {
		this.data[key] = value;
	}

	get(key) {
		return this.data[key];
	}

	getAll() {
		return this.data;
	}
}

module.exports = new SettingService();
