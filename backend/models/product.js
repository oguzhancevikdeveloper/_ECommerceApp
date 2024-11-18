const mongoose = require("mongoose");

// Şema tanımı
const productSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true, // Ürün adı zorunlu olmalı
        trim: true // Baş ve sondaki boşlukları otomatik kaldırır
    },
    description: {
        type: String,
        default: "" // Varsayılan olarak boş bir açıklama
    },
    imagesUrl: {
        type: [String], // Dizi türü belirtildi
        default: [] // Varsayılan olarak boş bir dizi
    },
    stock: {
        type: Number,
        required: true,
        min: 0 // Negatif stok olmasını engeller
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Negatif fiyat olmasını engeller
    },
    createdDate: {
        type: Date,
        default: Date.now // Varsayılan olarak şu anki tarih
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true // Varsayılan olarak aktif
    },
    categories: [{
        type: String,
        ref: "Category" // İlişkilendirilmiş model
    }]
});

// Model oluşturma
const Product = mongoose.model("Product", productSchema);

// Modeli dışa aktarma
module.exports = Product;
