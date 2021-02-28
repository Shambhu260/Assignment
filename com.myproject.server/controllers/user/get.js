const Category = require("../../models/user");

module.exports = async(req, res) => {
    try {
        let {
            sort,
            select,
            populate,
            limit,
            page,
            search,
            filters
        } = req.query;
        const {
            id,
            CategoryId,
            categoryName
        } = req.query;
        // The model query
        const find = {};
        let parsedFilters = null;
        // pagination object (search, sort, filter, etc);
        const where = {};
        if (filters && filters !== '[]') {
            parsedFilters = JSON.parse(filters);

            parsedFilters.forEach((f) => {
                let regexValue = {};
                if (f.column.type === 'boolean') {
                    regexValue = f.value === 'checked' ? true : false;
                } else if (Array.isArray(f.value) && f.value.length > 0) {
                    if (f.column.type === 'string') {
                        regexValue = {
                            $in: []
                        };
                        f.value.forEach((val) => {
                            regexValue.$in.push(val)
                        });
                    } else {
                        regexValue = {
                            $or: []
                        };
                        f.value.forEach((val) => {
                            regexValue.$or.push({
                                $eq: val
                            });
                        });
                    }
                } else if (f.column.type === 'numeric' || f.column.type === 'number') {
                    regexValue = {
                        $eq: f.value
                    };
                } else {
                    regexValue = {
                        $regex: new RegExp(f.value, "ig")
                    };
                }
                if (JSON.stringify(regexValue) !== '{}') find[f.column.field] = regexValue;
            });

        }


        // search
        if (search) {
            find.$or = [];
            find.$or.push({
                CategoryId: {
                    $regex: new RegExp(search, "ig")
                }
            })
            find.$or.push({
                categoryName: {
                    $regex: new RegExp(search, "ig")
                }
            })
        }

        // Validation
        // Pagination
        if (sort && typeof sort === 'string') sort = JSON.parse(sort);
        if (typeof sort !== 'undefined' && sort !== '') {
            where.sort = sort;
        }
        if (typeof select !== 'undefined' && select !== '') {
            where.select = select;
        }
        if (typeof populate !== 'undefined' && populate !== '') {
            where.populate = populate;
        } else {
            where.populate = "";
        }
        if (typeof limit !== 'undefined' && limit !== '') {
            where.limit = isNaN(limit) ? limit : Number(limit);
        } else {
            where.limit = 10;
        }
        if (typeof page !== 'undefined' && page !== '') {
            where.page = isNaN(page) ? page : Number(page);
        } else {
            where.page = 0;
        }
        if (typeof search !== 'undefined' && search !== '') {
            where.search = search;
        } else {
            where.search = "";
        }
        if (typeof filters !== 'undefined' && filters !== '') {
            where.filters = filters;
        } else {
            where.filters = "";
        }
        where.offset = where.page * where.limit;

        // Model Validation
        if (typeof id !== 'undefined') {
            try {
                find.id = JSON.parse(id)
            } catch (e) {
                find.id = id;
            }
        }
        if (typeof CategoryId !== 'undefined') {
            try {
                find.CategoryId = JSON.parse(CategoryId)
            } catch (e) {
                find.CategoryId = CategoryId;
            }
        }
        if (typeof categoryName !== 'undefined') {
            try {
                find.categoryName = JSON.parse(categoryName)
            } catch (e) {
                find.categoryName = categoryName;
            }
        }
        const CategoryObject = await Category.paginate(find, where);
        return res.json({
            category: CategoryObject
        });

    } catch (e) {
        console.error('GET => carrier', e);
        return res.status(500).json({
            error: e.message ? e.message : e
        });
    }
};
