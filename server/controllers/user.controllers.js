const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const index = (req, res) => {
    res.json({ message: "Hello World" });
};

const register = async (req, res) => {
    try {
        // check to make sure email is not the same
        const checkEmail = await User.findOne({ email: req.body.email });
        if (checkEmail) {
            res.status(400).json({
                errors: { email: { message: "Email in use" } },
            });
        } else {
            const data = new User(req.body);
            const user = await data.save();
            const payload = {
                _id: user._id,
                email: user.email,
                screenName: user.screenName,
            };
            // create a token
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            res.cookie("userToken", token, {
                expires: new Date(Date.now() + 900000),
            }).json({
                message: `Yay. Thanks for registering, ${user.screenName}.  Here is your jsonwebtoken: ${token}. This is your user payload information:`,
                user: payload,
            });
            console.log(
                `Yay. Thanks for registering, ${
                    user.screenName
                }.  Here is your jsonwebtoken: ${token}. This is your user payload information: ${JSON.stringify(
                    payload
                )}`
            );
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log("logging in:" + user);
    try {
        if (!user) {
            res.status(400).json({ errors: "Email not found" });
        } else {
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                res.status(400).json({ errors: "Invalid email/password" });
            } else {
                const payload = {
                    _id: user._id,
                    email: user.email,
                    screenName: user.screenName,
                };
                const token = jwt.sign(
                    { id: user._id },
                    process.env.SECRET_KEY
                );

                res.cookie("userToken", token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 900000),
                }).json({
                    successMessage: `userToken: ${token} `,
                    user: payload,
                });
                console.log(
                    `Thanks for logging in, ${user.screenName}.  Here's your userToken: ${token}`
                );
            }
        }
    } catch (err) {
        res.status(400).json({ errors: "oops something when wrong in login" });
        console.log("err", err);
    }
};

const logout = (req, res) => {
    console.log("logging out");
    res.clearCookie("userToken");
    res.json({ successMessage: "User logged out" });
};

const getLogged = async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.userToken, SECRET);
        const currentUser = await User.findOne({ _id: user._id });
        res.json(currentUser);
    } catch (error) {
        res.status(400).json({ errors: "failed to get logged in user" });
    }
};

const findAllUsers = async (req, res) => {
    User.find()
        .then((allUsers) =>
            res.json({ allUsers, message: "Here are all users" })
        )
        .catch((err) =>
            res.status(400).json({
                message: "Something went wrong while trying to view all users",
                error: err,
            })
        );
};

const findOneUser = async (req, res) => {
    User.findById(req.params.id)
        .then((user) =>
            res.json({
                user,
                message: "Yay you have found a specific user",
            })
        )
        .catch((err) =>
            res.status(400).json({
                message:
                    "Something went wrong while trying to find details of a user",
                error: err,
            })
        );
};

const updateUser = async (req, res) => {
    console.log("updateOne:", req.body);
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
        .then((e) => {
            res.json(e);
        })
        .catch((e) => res.json(e));
};

const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((deletedUser) =>
            res.json({ deletedUser, message: "Successfully deleted user." })
        )
        .catch((err) =>
            res.status(400).json({
                message: "Something went wrong while deleting/adopting.",
                error: err,
            })
        );
};
module.exports = {
    index,
    register,
    login,
    logout,
    getLogged,
    findAllUsers,
    findOneUser,
    updateUser,
    deleteUser,
};
