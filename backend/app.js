const express = require("express");
const app = express(); //server instance
const authRouter = require("./router/authRoute");
const databaseConnect = require("./config/databaseConfig");
const cookieParser = require("cookie-parser");
const cors = require("cors");

databaseConnect();

app.use(express.json()); //parse json data or allow
app.use(cookieParser()); //to parse cookies before going to any route
app.use(
    cors({
        origin: [process.env.CLIENT_URL],
        credentials: true, //cookie set automatimatically
    })
);

app.use("/api/auth/", authRouter); //all other routes the request coming to /api/auth (prefix)by default goes to (points to)authRoute and use path defined inside that

app.use("/", (req, res) => {
    res.status(200).json({ data: "auth server" });
}); //basic route

module.exports = app;
