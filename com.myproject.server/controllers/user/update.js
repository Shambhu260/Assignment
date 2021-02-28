const user = require("../../models/user");

module.exports = async(req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            profileImg
        } = req.body;

        const {
            id
        } = req.params;
        const existingUser = await user.findOne({
            _id: id
        });
        if (typeof id !== 'undefined' &&
            typeof id === "schema.types.objectid") {
            existingUser.id = id;
        }
        if (typeof firstName !== 'undefined' &&
            typeof firstName === "string" && firstName) {
            existingUser.firstName = firstName;
        }
        if (typeof lastName !== 'undefined' &&
            typeof lastName === "string" && lastName) {
            existingUser.lastName = lastName;
        }
        if (typeof email !== 'undefined' &&
            typeof email === "string" && email) {
            existingUser.email = email;
        }
        if (typeof phone !== 'undefined' &&
            typeof phone === "string" && phone) {
            existingUser.phone = phone;
        }
        if (typeof profileImg !== 'undefined' &&
            typeof profileImg === "string" && profileImg) {
            existingUser.profileImg = profileImg;
        }
        const updated = await existingUser.save();
        return res.status(200).json({
            user: updated
        });

    } catch (e) {
        console.error('Update => user', e);
        return res.status(500).json({
            error: e.message ? e.message : e
        });
    }
};