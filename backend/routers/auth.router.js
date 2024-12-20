const express = require("express");
const router = express.Router();
const {v4 : uuidv4} = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const upload  = require("../services/file.service");
const token = require("../services/token.service");
let sendMail = require("../services/mail.service");
const MailOptions = require("../dtos/mail-options");
const errorHandler = require("../services/error.service");
const jwt = require('jsonwebtoken');
const response = require("../services/response.service");

router.post("/register",async (req,res) => {

    const newUser = new User(req.body);

    newUser.createdDate = Date.now();
    newUser._id = uuidv4();
    newUser.isMailConfirm = false;

    try {
        let mailConfirmCode = create6DigitCode();
        let checkMailConfirmCode = await User.find({ isMailConfirmCode: mailConfirmCode });
        while (checkMailConfirmCode.length > 0) {
            mailConfirmCode = create6DigitCode();
            checkMailConfirmCode = await User.find({ isMailConfirmCode: mailConfirmCode });
        }
        newUser.mailConfirmCode = mailConfirmCode;
        const result = await newUser.save();
        sendConfirmMail(newUser);
        res.json({ message: "Your user has been successfully created. You can log in after mail confirmation!" });

    } catch (error) {
        if (error.code == "11000") {
            errorHandler(res,{ message: "User mail/username is invalid!" });            
        }
        else {
            errorHandler(res,error);
        }
    }

});

create6DigitCode = () =>{
    return Math.floor(Math.random() * 1000000);
}

sendConfirmMail = (user) => {
    let mailOptions = new MailOptions(
        user.email,
        "Mail Onayı",
        `
        <div class="container text-center">
        <h1>Tebrikler</h1>
        <p>Kaydınızı tamamlamak için son bir adım kaldı. Aşağıdaki linke tıklayarak mail adresinizi onaylayabilir ve uygulamızı ücretsiz şekilde kullanabilirsiniz</p>
        <hr>
        <a href="http://localhost:4200/confirmMail/${user.mailConfirmCode}" class="btn btn-primary">Mail Adresimi Onayla</a>
        </div> `
    )

    sendMail(mailOptions);
}

sendForgotPasswordMail = (user) => {
    let mailOptions = new MailOptions(
        user.email,
        "Şifremi Unuttum!",
        `
        <div class="container text-center">
        <h1>Şifrenizi Yenilemek için</h1>
        <p>Aşağıdaki kodu size açılan sayfada ilgili alana girerek şifrenizi yenileyebilirsiniz! Eğer sayfayı kapattıysanız ya da açılmadıysa aşağıdaki <strong>'Sayfaya Git'</strong> linkini tıklayarak sayfaya ulaşabilirsiniz!</p>
        <hr>
        <h1>Kod: ${user.forgotPasswordCode}</h1>
        <a href="http://localhost:4200/forgot-password/${user._id}/${user.forgotPasswordCode}">Sayfaya Git</a>
        </div>
        `       
    )

    sendMail(mailOptions);
}

//Mail Onayla
router.post("/confirm-mail", async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({ mailConfirmCode: code });
        if (user == null) {
            errorHandler(res,{ "message": "Kullanıcı bulunamadı!" })            
        } else {
            if (user.isMailConfirm) {
                errorHandler(res,{ "message": "Kullanıcı maili zaten onaylı!" })                
            } else {
                user.isMailConfirm = true;
                const result = await User.findByIdAndUpdate(user._id,user);
                res.json({ message: "Mail adresiniz başarıyla onaylandı!"});
            }
        }
    } catch (error) {
        errorHandler(res,error);
    }
});

//Giriş İşlemi
router.post("/login", async (req, res) => {
    response(res, async () => {
        const { emailOrUserName, password } = req.body;

        // E-posta veya kullanıcı adı ile kullanıcıyı bulma
        let user = await User.findOne({ $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] });

        if (!user) {
            return errorHandler(res, { message: "Kullanıcı bulunamadı!" });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return errorHandler(res, { message: "Şifre yanlış!" });
        }

        // Mail onayı kontrolü
        if (!user.isMailConfirm) {
            return errorHandler(res, { message: "Mail adresiniz onaylı değil! Onaylamadan giriş yapamazsınız!" });
        }

        // Kullanıcı bilgilerini payload olarak göndermek
        const payload = { user };

        // Token'ı 1 saatlik bir süreyle oluştur
        const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }); // 1 saatlik token

        res.json({ token, user });
    });
});
//Google Login İşlemi
router.post("/googleLogin", async (req,res)=> {
    response(res, async()=>{
        const {id, email, name, photoUrl} = req.body;
        let users = await User.find({email: email});

        let mailConfirmCode = create6DigitCode();
        let checkMailConfirmCode = await User.find({ isMailConfirmCode: mailConfirmCode });
        while (checkMailConfirmCode.length > 0) {
            mailConfirmCode = create6DigitCode();
            checkMailConfirmCode = await User.find({ isMailConfirmCode: mailConfirmCode });
        }

        if(users.length == 0){
            let user = new User({
                _id: uuidv4(),
                email: email,
                name: name,
                password: id,
                userName: email,
                createdDate: new Date(),
                imageUrl: photoUrl,
                isAdmin: false,
                isMailConfirm: true,
                mailConfirmCode: mailConfirmCode,                
            });

            await user.save();
            const payload = {
                user: user
            }
            res.json({ token: token(payload), user: user });
        }else{
            const payload = {
                user: users[0]
            }
            res.json({ token: token(payload), user: users[0] });
        }
    });
});

//Onaylama Maili Gönder
router.post("/sendConfirmMail", async (req, res)=>{
    try {
        const {emailOrUserName} = req.body;

        let users = await User.find({email:emailOrUserName});        
        if(users.length == 0){
            users = await User.find({userName: emailOrUserName});
            if(users.length == 0){
                errorHandler(res,{ message: "Kullanıcı bulunamadı!" });            
            }
            else{
                if(users[0].isMailConfirm){
                    errorHandler(res,{ message: "Mail adresi zaten onaylı!" });                    
                }else{                
                    sendConfirmMail(users[0]);
                    res.json({message: "Onay mailiniz başarıyla gönderildi!"});
                } 
            }
        }else{
            if(users[0].isMailConfirm){
                errorHandler(res,{ message: "Mail adresi zaten onaylı!" });                
            }else{                
                sendConfirmMail(users[0]);
                res.json({message: "Onay mailiniz başarıyla gönderildi!"});
            }
        }
    } catch (error) {
        errorHandler(res,error);        
    }
});

//Şifremi Unuttum Maili Gönder
router.post("/sendForgotPassword", async (req, res) => {
    try {
        const {emailOrUserName} = req.body;
        var users = await User.find({email: emailOrUserName});
        if(users.length == 0){
            users = await User.find({userName: emailOrUserName});
            if(users.length == 0){
                errorHandler(res,{message: "Kullanıcı bulunamadı!"});                  
            }else{
                users[0].forgotPasswordCode = create6DigitCode();            
                users[0].isForgotPasswordCodeActive = true;
                await User.findByIdAndUpdate(users[0]._id,users[0]);
                sendForgotPasswordMail(users[0]);
    
                res.json({_id: users[0]._id});
            }
           
        }else{
            users[0].forgotPasswordCode = create6DigitCode();   
            users[0].isForgotPasswordCodeActive = true;
            await User.findByIdAndUpdate(users[0]._id,users[0]);
            sendForgotPasswordMail(users[0]);

            res.json({_id: users[0]._id});
        }
    } catch (error) {
        errorHandler(res,error);
    }
})

//Şireyi Değiştir
router.post("/refreshPassword", async (req, res) => {
    try {
        const {_id, code, newPassword} = req.body;
        let users = await User.find({_id: _id, forgotPasswordCode: code});
        if(users.length == 0){
            errorHandler(res,{message: "Kullanıcı bulunamadı ya da kod geçersiz!"});            
        }else{
            if(!users[0].isForgotPasswordCodeActive){
                errorHandler(res,{message: "Kod geçersiz!"});                
            }else{
                users[0].password = newPassword;
                users[0].isForgotPasswordCodeActive = false;
                await User.findByIdAndUpdate(_id, users[0]);
                res.json({message: "Şifreniz başarıyla değiştirildi!"});
            }
        }
    } catch (error) {
        errorHandler(res,error);        
    }
});

module.exports = router;