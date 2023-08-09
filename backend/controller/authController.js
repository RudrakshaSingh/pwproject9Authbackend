const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt"); // we need to use await

const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body; //as it is post call we send user info given by body
    console.log(name, email, password, confirmPassword);

    if (!name || !email || !password || !confirmPassword) {
        //controller level validations(if any of the value is not given)
        return res.status(400).json({
            success: false,
            message: "every field is required",
        });
    }

    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email id",
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "password and confirm password doesn't match",
        });
    }

    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save(); // to save in database directly

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        if (e.code === 11000) {
            //in case of duplicate entry
            return res.status(400).json({
                success: false,
                messge: "account already existswith provided emailid",
            });
        }
        return res.status(400).json({
            success: false,
            messge: e.message,
        });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "every field is mandatory",
        });
    }

    try {
        const user = await userModel.findOne({ email }).select("+password"); // to select password is this email exist even is is given in schema that it is not aloowed

        if (!user || !(await bcrypt.compare(password, user.password))) {
            //as hashing is done to password which is one way so we compare given password and hash it and compare it with hashes password in DB.we are now comparing password as text and it is wrong so we compare first without enccrpt to encyptedone
            return res.status(400).json({
                success: false,
                message: "invalid credentials for signin",
            });
        }

        const token = user.jwtToken();
        user.password = undefined; // to set password null

        const cookieOption = {
            //24*60*60*1000 millisecond
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true, //so that the cookie is not accessible from client or JS side
        };

        res.cookie("token", token, cookieOption); //set the cookie(nameofcookie,realtoken,options)
        res.status(200).json({
            success: true,
            message: "successfully logined",
            data: user, //password is not given
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

const getUser = async (req, res, next) => {
    //we need userid and we should know if user is already login and has a token
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            data: e.message,
        });
    }
};

const logout = (req, res) => {
    try {
        const cookieOption = {
            //not much significance but good to define yourself
            expires: new Date(), //todays date
            httpOnly: true,
        };
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success: true,
            message: "logged out",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};
module.exports = {
    signup,
    signin,
    getUser,
    logout,
};
