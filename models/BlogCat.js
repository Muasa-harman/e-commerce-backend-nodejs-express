const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogCatSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        indexed:true
    },
},{timestamps: true});

//Export the model
module.exports = mongoose.model('BlogCat', blogCatSchema);