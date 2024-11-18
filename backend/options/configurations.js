const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt"); // Şifreleme için bcrypt kütüphanesi

const createAdminUser = async () => {
    try {
        // Kullanıcı sayısını bulmak için countDocuments() kullanıyoruz
        let userCount = await User.countDocuments({});
        
        if (userCount === 0) {
            // Şifreyi hash'lemek
            const hashedPassword = await bcrypt.hash("1", 10);

            // Yeni kullanıcı oluşturma
            let newUser = new User({
                _id: uuidv4(),
                name: "Oguzhan Cevik",
                userName: "oguzhancevik",
                email: "oguzhancevik.developer@gmail.com",
                isMailConfirm: true,
                mailConfirmCode: "000000",
                password: hashedPassword, // Hash'lenmiş şifre kullanılıyor
                createdDate: new Date(), // Doğrudan Date nesnesi
                isAdmin: true,
                forgotPasswordCode: "000000",
                isForgotPasswordCodeActive: false
            });

            // Yeni kullanıcıyı kaydet
            await newUser.save();
            console.log("Admin kullanıcı başarıyla oluşturuldu.");
        } else {
            console.log("Zaten kullanıcı mevcut, admin oluşturulmadı.");
        }
    } catch (error) {
        console.error("Admin kullanıcı oluşturulurken bir hata meydana geldi:", error);
    }
};

module.exports = createAdminUser;
