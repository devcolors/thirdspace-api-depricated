const mongoose = require('mongoose');

const getImage = (fileId, bucketName) => {
    console.log("getImage: ", fileId, bucketName);

    if (!fileId) return undefined
    
    return new Promise((resolve, reject) => {
      try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: bucketName
        });
  
        const downloadStream = bucket.openDownloadStream(fileId);
  
        let chunks = [];
        downloadStream.on('data', (chunk) => {
          chunks.push(chunk);
        });
  
        downloadStream.on('error', (error) => {
          console.log(error);
          reject(error);
        });
  
        downloadStream.on('end', () => {
          let result = Buffer.concat(chunks);
          let base64Image = Buffer.from(result).toString('base64');
          console.log("getImage: ", base64Image.substring(0, 10));
          resolve(base64Image);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
}

module.exports = {getImage}