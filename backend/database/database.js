const mongoose = require("mongoose");

const connection = async () =>{
    try {
        const url ="";
        var result = await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

module.exports = connection;