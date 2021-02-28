const Category = require("../../models/category");
const Product = require("../../models/product");

module.exports = async(req, res) => {

    try {
        const { id } = req.params;

        let existingCategory = null;
        let existingProduct = null;
        const product = await Product.findOne({ _id: id });
        if (product) {
            existingCategory = await Category.find({
                _id: product.supportedCategory
            });
        }
        if (product) {
            existingProduct = await Product.find({
                _id: id
            });
        }

        if (!existingCategory)
            throw new Error('Category not found.');

        return res.json({
            category: existingCategory,
            existingProduct
        });

    } catch (e) {
        console.error('GetOne => ', e);
        return res.status(500).json({
            error: e.message ? e.message : e
        });
    }
};