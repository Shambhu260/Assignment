const User = require("../../models/user");
module.exports = async(req, res) => {
    try {
        const {
            id
        } = req.params;
        const existingUser = await User.findOne({
            _id: id
        });
        if (!existingUser) throw new Error('User not found.');
        return res.status(200).json({
            user: existingUser
        });

    } catch (e) {
        console.error('GetOne => Category', e);
        return res.status(500).json({
            error: e.message ? e.message : e
        });
    }
};