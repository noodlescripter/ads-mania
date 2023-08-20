require('dotenv').config();
const cloudinary = require('cloudinary');
const {CloudinaryStorage} = require('multer-storage-cloudinary');

/* Processing everyyhing here only */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary, 
    folder: 'AdsMania',
    allowedFormats: ['jpeg', 'png', 'jpg']
});

module.exports = {
    cloudinary, 
    storage
}