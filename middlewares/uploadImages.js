const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cd) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.filename + "-" + uniqueSuffix + '.jpg');
    }
});


const multerFilter = (req, file, cd) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }
    else {
        cb({ message: "Unsupported file format" },
            false
        );
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 }
});
const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg')
        .jpeg({ quality: 90 }).toFile(`public/images/product/${file.filename}`);
    }));
}

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg')
        .jpeg({ quality: 90 }).toFile(`public/images/blogs/${file.filename}`);
    }));
}

module.exports = { uploadPhoto,blogImgResize ,productImgResize}