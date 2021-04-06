const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'ackd151',
    api_key: '988843633939511',
    api_secret: process.env.CLOUDINARY_SECRET
});
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'surf-shop',
  },
  allowedFormats: ['jpeg', 'jpg', 'png'],
  filename: function (req, file, cb) {
  	let buf = crypto.randomBytes(16);
  	buf = buf.toString('hex');
  	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
  	uniqFileName += buf;
    cb(undefined, uniqFileName );
  }
});

module.exports = {
	cloudinary,
	storage
}