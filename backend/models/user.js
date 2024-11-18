const mongoose = require("mongoose");

const userSchema = new mongoose({
    _id: String,
    name: {
        type: String,
        required: true,
        minLength: [3, "Name&Surname part should be least 3 character"]
    },
    userName: {
        type: String,
        required: true,
        minLength: [3, "Username part should be least 3 character"],
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: [3, "Mail part should be least 3 character"],
        email: ["Write a valid e-mail address!"],
        unique: true
    },
    imageUrl: {
        type: String,        
    },
    password: {
        type: String,
        required: true,
    },
    mailConfirmCode: String,
    isMailConfirm: Boolean,
    createdDate: Date,
    updatedDate: Date,
    isAdmin: Boolean,
    forgotPasswordCode: String,
    isForgotPasswordCodeActive: Boolean
})

const User = userSchema.model("User",userSchema);
module.exports = User;