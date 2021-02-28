const User = require("../../models/user");
module.exports = async(req, res) => {
    try {
        const {
            id,
            firstName,
            lastName,
            email,
            phone,
            profileImg
        } = req.body;
        const newUser = {};
        // Validate
        if (typeof id !== 'undefined' &&
            typeof id === "schema.types.objectid") {
            newUser.id = id;
        }
        if (typeof firstName !== 'undefined' &&
            typeof firstName === "string" && firstName) {
            newUser.firstName = firstName;
        }
        if (typeof lastName !== 'undefined' &&
            typeof lastName === "string" && lastName) {
            newUser.lastName = lastName;
        }
        if (typeof email !== 'undefined' &&
            typeof email === "string" && email) {
            newUser.email = email;
        }
        if (typeof phone !== 'undefined' &&
            typeof phone === "string" && phone) {
            newUser.phone = phone;
        }
        if (typeof profileImg !== 'undefined' &&
            typeof profileImg === "string" && profileImg) {
            newUser.profileImg = profileImg;
        }
        const created = await User.create(newUser);
        return res.status(200).json({
            user: created
        });

    } catch (e) {
        console.error('Create => user', e);
        return res.status(500).json({
            error: e.message ? e.message : e
        });
    }
};