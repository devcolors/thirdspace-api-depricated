const express = require('express');
const router = express.Router();
const {getImage} = require('../helpers')
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

module.exports = router;