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
        const deleted = await existingUser.delete();
        return res.json({
            user: "User Deleted"
        });

    } catch (e) {
        console.error('Delete => User', e);
        return res.status(500).json({
            error: e.message ? e.message : e
        });
    }
};