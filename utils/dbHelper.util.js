const getOffset = (currentPage = 1, listPerPage) => {
	return (currentPage - 1) * [listPerPage];
};

const emptyOrRows = (rows) => {
	if (!rows) {
		return [];
	}
	return rows;
};

const filter = false;
const search = null;
const sort_col = 'created_date';
const sort_dir = 'desc';
const offset = 0;
const limit = 50;

module.exports = {
	getOffset,
	emptyOrRows,
	filter,
	search,
	sort_col,
	sort_dir,
	offset,
	limit
};
