const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: 'dgo4ievvs',
    api_key: '688346717439875',
    secure: true,
    api_secret: process.env.CLOUDINARY_SECRET,

});

module.exports = cloudinary;