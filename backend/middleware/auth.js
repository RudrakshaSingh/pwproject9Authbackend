const JWT = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = (req.cookies && req.cookies.token) || null; //as network communication is aaways serialized so we need to covert(to parse cookies) to json to read token  we need cookieparser

    if (!token) {
        return res.status(400).json({
            succes: false,
            message: "not authorized",
        });
    }
    try {
        const payload = JWT.verify(token, process.env.SECRET); //to get id and info in token//In Node.js, the term "payload" refers to the data or information carried within a request or response. It serves as the essential content exchanged between clients and servers
        req.user = { id: payload.id, email: payload.email }; //we are setting it in user so that it moves forward tp controller we can access it as req.user
    } catch (e) {
        return res.status(400).json({
            succes: false,
            message: "not authorized",
            error: e.message,
        });
    }

    next(); //next is used to allow one procees to go to another otherwise it will not go to next step
};

module.exports = auth;
