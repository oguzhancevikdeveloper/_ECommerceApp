const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const {v4:uuidv4} = require("uuid");
const response = require("../services/response.service");
const User = require("../models/user");
const Product = require("../models/product");

//Kategori Listesi
router.get("/getAll", async (req, res)=>{
    response(res, async() => {
        const categories = await Category.find({}).sort({name: 1});
        res.json(categories);
    });
});

//Kategori Ekleme İşlemi
router.post("/add", async (req, res)=>{
    response(res, async()=>{
        const {name} = req.body;
        let category = new Category({
            _id: uuidv4(),
            name: name.toUpperCase(),
            createdDate: new Date()
        });
        await category.save();
        res.json({message: "Kategori kaydı başarıyla tamamlandı"});
    });
});

//Kategori Silme İşlemi
router.post("/removeById", async (req, res) => {
    response(res, async () => {
        const { _id } = req.body;
        
        // Kategoriye bağlı ürün var mı kontrol et
        const result = await Product.find({ categories: _id });

        if (result.length > 0) {
            // Eğer kategoriye bağlı ürün varsa, silme işlemini engelle
            res.status(500).json({ message: "Ürüne bağlı kategoriler silinemez. Önce ürün bağlantısını koparın!" });
        } else {
            // Kategoriyi sil
            try {
                const deletedCategory = await Category.findByIdAndDelete(_id); // findByIdAndRemove yerine findByIdAndDelete kullanıyoruz.

                if (deletedCategory) {
                    // Silme işlemi başarılı ise
                    res.json({ message: "Kategori kaydı başarıyla silindi!" });
                } else {
                    // Kategori bulunamazsa
                    res.status(404).json({ message: "Kategori bulunamadı!" });
                }
            } catch (error) {
                // Hata meydana gelirse
                console.error("Kategori silme hatası:", error);
                res.status(500).json({ message: "Silme işlemi sırasında bir hata oluştu." });
            }
        }
    });
});


//Kategori Güncelleme İşlemi
router.post("/update", async (req, res)=>{
    response(res, async()=>{
        const {_id, name} = req.body;
        const category = await Category.findById(_id);
        category.name = name.toUpperCase();
        await Category.findByIdAndUpdate(_id, category);
        res.json({message: "Kategori başarıyla güncellendi"});
    });
});

module.exports = router;