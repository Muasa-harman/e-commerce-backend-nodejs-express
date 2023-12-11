const mongoose = require('mongoose');


const validateMongoDbId = (id) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error(' This in not a valid or Found');

};

module.exports = validateMongoDbId;