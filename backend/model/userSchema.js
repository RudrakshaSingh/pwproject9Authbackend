const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "user name is required"], //we can put validation in 3place 1) in client where we write react app 2)in controllers we can validate3)while stroing in database in schema
            minLength: [5, "name must be minimum 5 characters"],
            maxLength: [50, "name must be less than 50 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "user email is required"],
            unique: true,
            lowercase: true,
            unique: [true, "already registered"],
        },
        password: {
            type: String,
            select: false, //In Mongoose, select: false is an option that you can add to a field in the schema to specify that the field should not be included in query results by default. It's a way to hide sensitive or unnecessary data from being returned in query results, such as passwords or other confidential information.
        },
        forgetPasswordToken: {
            type: String,
        },
        forgotPasswordExpiryDate: {
            type: Date,
        },
    },
    {
        timestamps: true, // to create timestamp in every entry which creates timestamp entry by default
    }
);

//custom middleARE that will trigger every time when someone is saving(creating a entry)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10); //10 random number if passord is modified
    return next();
});

userSchema.methods = {
    //to define custom methods in mongoose

    //method for generating the jwt token
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            { expiresIn: "24h" } // 24 hours
        );
    },
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
