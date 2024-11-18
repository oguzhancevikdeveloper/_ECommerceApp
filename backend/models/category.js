const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id:String,
    name:{
        type : String,
        unique : true,
        require : true
    },
    createdDate : String

});
const Category = categorySchema.model("Category",categorySchema);

module.exports = Category;