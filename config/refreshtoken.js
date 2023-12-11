const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv').config();

const generateRefreshToken = (id) =>{
    const refreshToken = jwt.sign({id},process.env.JWT, {expiresIn:'3d'
});

    return refreshToken;

};

module.exports = generateRefreshToken;