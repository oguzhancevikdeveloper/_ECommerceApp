const mongoose = require("mongoose");

const connection = async () =>{
    try {
        const url ="mongodb+srv://oguzhancevikdeveloper:4j5rfSO8O3a0xWLt@ecommercedb.sc6xa.mongodb.net/";
        var result = await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

module.exports = connection;