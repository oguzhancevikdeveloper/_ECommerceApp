const User = require("../models/user");
const {v4:uuidv4} = require("uuid");

const createAdminUser = async() => {

    let userCount = await User.find({}).count();

    if(userCount == 0){
        let newUser = new User({
            _id : uuidv4,
            name: "Oguzhan Cevik",
            userName : "oguzhancevik",
            email : "oguzhancevik.developer@gmail.com",
            isMailConfirmed : true,
            mailConfirmModel : "000000",
            password : "1",
            createdDate : Date.now(),
            isAdmin : true,
            forgotPassword :"00000",
            isForgotPasswordCodeActive : false,
        });

        await newUser.save();
    }
}

module.exports = createAdminUser;