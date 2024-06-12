const express = require('express');
const router = express.Router();
const {getImage} = require('./helpers')
const mongoose = require('mongoose');

// Read (GET) any base64Image using fileID
router.get('/image/:fileId/:bucketName', async (req, res) => {
    let fileId = req.params.fileId
    let  bucketName = req.params.bucketName
  
    console.log("fileId and bucketName:\n", fileId, bucketName)
    
    if (!fileId) res.status(404).send("no file ID provided")
    if (!bucketName) res.status(404).send("no bucket name provided")
  
    let base64Image = await getImage(new mongoose.Types.ObjectId(fileId), bucketName)
  
    console.log("First 10 chars of base64Image: ", base64Image.substring(0, 10))
  
    res.send(base64Image)
});

// Route to stream video
router.get('/video/:fileId/:bucketName', async (req, res) => {
    try {
      const fileId = new mongoose.Types.ObjectId(req.params.fileId);
      const bucketName = req.params.bucketName; // Set your bucket name accordingly
  
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: bucketName
      });
  
      const downloadStream = bucket.openDownloadStream(fileId);
  
      downloadStream.on('file', (file) => {
        if (!file) {
          return res.status(404).send('No video exists');
        }
  
        // Set the appropriate response headers for video streaming
        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Length', file.length);
      });
  
      downloadStream.on('data', (chunk) => {
        res.write(chunk);
      });
  
      downloadStream.on('error', (error) => {
        console.error(error);
        res.status(500).send('Server error');
      });
  
      downloadStream.on('end', () => {
        res.end();
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

module.exports = router;