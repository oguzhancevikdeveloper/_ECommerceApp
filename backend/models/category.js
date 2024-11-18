const mongoose = require("mongoose");

// Şema tanımı
const categorySchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        unique: true,
        required: true // "require" yerine "required" olmalı
    },
    createdDate: String
});

// Model oluşturma
const Category = mongoose.model("Category", categorySchema);

// Modeli dışa aktarma
module.exports = Category;
