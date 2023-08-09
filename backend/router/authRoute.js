const express = require("express");
const {
    signup,
    signin,
    getUser,
    logout,
} = require("../controller/authController");
const auth = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/signup", signup); // post is used to pass secure data and create something
authRouter.post("/signin", signin);
authRouter.get("/user", auth, getUser); //first go to auth
authRouter.get("/logout", auth, logout);

module.exports = authRouter;
