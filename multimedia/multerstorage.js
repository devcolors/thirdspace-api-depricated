const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config();

// Function to determine if a file is an image
const pictureFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file'), false);
  }
};

const pictureStorage = new GridFsStorage({
  url: process.env.MONGO_URI, // Your MongoDB URI
  file: (req, file) => {
    return {
      filename: 'file_' + Date.now(), // Use a unique filename
      bucketName: 'profilePictures', // The collection name in MongoDB
    };
  }
});

// Function to determine if a file is a video
const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(new Error('Not a video file'), false);
  }
};

const videoStorage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: 'video_' + Date.now(),
      bucketName: 'profileVideos' // Separate bucket for videos
    };
  }
});

const videoUpload = multer({ storage: videoStorage, fileFilter: videoFileFilter });
const pictureUpload = multer({ storage: pictureStorage, fileFilter: pictureFileFilter });

module.exports = { pictureUpload, videoUpload }; // Export both upload functions
