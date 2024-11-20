const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt"); // Şifreleme için bcrypt kütüphanesi

// Rastgele bir kod oluşturma fonksiyonu
const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const createAdminUser = async () => {
    try {
        // Kullanıcı sayısını bulmak için countDocuments() kullanıyoruz
        const userCount = await User.countDocuments({});

        // Admin kullanıcısını kontrol et
        const adminExists = await User.findOne({ isAdmin: true });
        if (userCount === 0 || !adminExists) {
            // Şifreyi hash'lemek
            const hashedPassword = await bcrypt.hash("1", 10);

            // Yeni kullanıcı oluşturma
            const newUser = new User({
                _id: uuidv4(), // UUID kullanıyorsunuz
                name: "Oguzhan Cevik",
                userName: "oguzhancevik",
                email: "oguzhancevik.developer@gmail.com",
                isMailConfirm: true,
                mailConfirmCode: generateRandomCode(), // Dinamik kod oluşturma
                password: hashedPassword, // Hash'lenmiş şifre kullanılıyor
                createdDate: new Date(), // Doğrudan Date nesnesi
                isAdmin: true, // Admin olarak işaretli
                forgotPasswordCode: generateRandomCode(), // Dinamik kod
                isForgotPasswordCodeActive: false
            });

            // Yeni kullanıcıyı kaydet
            await newUser.save();
            console.log("Admin kullanıcı başarıyla oluşturuldu.");
        } else {
            console.log("Zaten bir admin kullanıcı mevcut, admin oluşturulmadı.");
        }
    } catch (error) {
        console.error("Admin kullanıcı oluşturulurken bir hata meydana geldi:", error.message || error);
    }
};

module.exports = createAdminUser;
