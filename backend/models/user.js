const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: [true, "Ad soyad kısmı zorunludur!"],
        minlength: [3, "Ad soyad kısmı en az 3 karakter olmalıdır!"] // "minLength" yerine "minlength" olmalı
    },
    userName: {
        type: String,
        required: [true, "Kullanıcı adı kısmı zorunludur!"],
        minlength: [3, "Kullanıcı adı kısmı en az 3 karakter olmalıdır!"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Mail adresi zorunludur!"],
        minlength: [3, "Mail adresi en az 3 karakter olmalıdır!"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Geçerli bir mail adresi yazın!"] // E-posta format doğrulaması
    },
    imageUrl: {
        type: String,
        default: "" // Varsayılan olarak boş bir string atanabilir
    },
    password: {
        type: String,
        required: [true, "Şifre zorunludur!"]
    },
    mailConfirmCode: {
        type: String,
        default: null
    },
    isMailConfirm: {
        type: Boolean,
        default: false // Varsayılan olarak doğrulanmamış
    },
    createdDate: {
        type: Date,
        default: Date.now // Varsayılan olarak oluşturulma tarihi
    },
    updatedDate: {
        type: Date,
        default: Date.now // Varsayılan olarak güncelleme tarihi
    },
    isAdmin: {
        type: Boolean,
        default: false // Varsayılan olarak admin değil
    },
    forgotPasswordCode: {
        type: String,
        default: null
    },
    isForgotPasswordCodeActive: {
        type: Boolean,
        default: false // Varsayılan olarak inaktif
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
