const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // Your MongoDB URI
  file: (req, file) => {
    return {
      filename: 'file_' + Date.now(), // Use a unique filename
      bucketName: 'profilePictures', // The collection name in MongoDB
    };
  }
});

const upload = multer({ storage: storage });

module.exports = upload
