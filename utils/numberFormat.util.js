const dec = (num) => {
	num = parseFloat(num);
	if (num == 0) return 0;
	return parseFloat((Math.floor(num * 100) / 100).toFixed(2));
};

const xnf = (num) => {
	num = Number(num);
	if (num == 0) return 0;
	return Number((Math.floor(num * 100) / 100).toFixed(2));
};

module.exports = {
	dec,
};
