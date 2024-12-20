const connection = require("./database/database");
const express = require("express");
const cors = require("cors");
const createAdminUser = require("./options/configurations");
const User = require("./models/user");
const path = require("path");

//Routerlar
const authRouter = require("./routers/auth.router");
const categoryRouter = require("./routers/category.router");
const productRouter = require("./routers/product.router");
const basketRouter = require("./routers/basket.router");

//Api istekleri için
const app = express();

//Resim dosyalarını okuma için izin ver
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//İsteklerde JSON formatı geçerli olsun
app.use(express.json());

//CORS politikası
app.use(cors());

//Db Connection
connection();

//Admin Kullanıcısı Yoksa Eğer Ekle
createAdminUser();

//Auth Router
app.use("/api/auth/", authRouter);

//Category Router
app.use("/api/categories/", categoryRouter);

//Basket Router
app.use("/api/baskets/", basketRouter);

//Product Router
app.use("/api/products/", productRouter);

app.use('/uploads', express.static('uploads'));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Sunucu çalışıyor..."));