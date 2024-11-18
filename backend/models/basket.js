const mongoose = require("mongoose");

// Şema tanımı
const basketSchema = new mongoose.Schema({
    _id: String,
    productId: String,
    userId: String,
    quantity: Number,
    price: Number,
    createdDate: {
        type: Date,
        default: Date.now // Varsayılan değer olarak şu anki tarih
    }
});

// Model oluşturma
const Basket = mongoose.model("Basket", basketSchema);

// Modeli dışa aktarma
module.exports = Basket;
 

