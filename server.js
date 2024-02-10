const express = require('express');
const router = express.Router();
const user = require('./user'); // Adjust this to the correct path of your model
const upload = require('./multerstorage')
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const { ObjectId } = require('mongodb');

// Create (POST)
router.post('/users', async (req, res) => {
    console.log('create');
    try {
        const newuser = new user(req.body);
        await newuser.save();
        res.status(201).send(newuser);
    } catch (error) {
      res.status(500).send(error);
    }
  });

// Create Bulk (POST)
router.post('/users_bulk', async (req, res) => {
    console.log('create bulk');
    console.log(req.body);
    try {
        req.body.forEach(async elt => {
          const newuser = new user(elt);
          await newuser.save();
        });
        res.status(201).send('all done');
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  
  // Read (GET)
  router.get('/users', async (req, res) => {
    console.log('read');
    try {
      const users = await user.find();
      res.status(200).send(users);
    } catch (error) {
      console.log('error')
      res.status(500).send(error);
    }
  });
  
  // Read (GET) by id
  router.get('/users/:id', async (req, res) => {
    console.log('read by id');
    try {
      const users = await user.findById(req.params.id);
      if (!users) {
        console.log('error user does not exist')
        res.status(404).send('user does not exist');
      }
      res.status(200).send(users);
    } catch (error) {
      console.log('error user does not exist')
      res.status(500).send(error);
    }
  });
  
  // Update (PATCH)
  router.patch('/users/:id', async (req, res) => {
    console.log('update');
    try {
      const updateduser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).send(updateduser);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Update (PATCH) profile picture
  router.patch('/users/:id/profile-picture', upload.single('profilePicture'), async (req, res) => {
    console.log('image upload');
    try {
      const userFound = await user.findById(req.params.id);
      if (!userFound) {
        return res.status(404).send('User not found');
      }
      userFound.profilePicture = !(req.file.id) ? 'undefined' : req.file.id; 
      await userFound.save();
      
      res.status(200).send(userFound);
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  });

  // Read (GET) profile picture
  router.get('/users/:id/profile-picture', async (req, res) => {
    console.log('getting prof pic');
    console.log(req.headers);

    try {
      const userFound = await user.findById(req.params.id);

      console.log('user found:\n', userFound);

      if (!userFound) {
        return res.status(404).send('User not found');
      }

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'profilePictures'
      });

      const downloadStream = bucket.openDownloadStream(userFound.profilePicture);

      let chunks = [];
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on('error', function(error) {
        res.status(500).send({ errorMsg: 'Error fetching image. Make sure the image exists and the ID is correct.', err: error});
      });

      downloadStream.on('end', () => {
        let result = Buffer.concat(chunks);

        let base64Image = Buffer.from(result).toString('base64');    
        res.send(base64Image);
      });
      } catch (error) {
        console.log(error)
        res.status(500).send(error);
      }
});
  
  // Delete (DELETE)
  router.delete('/users/:id', async (req, res) => {
    console.log('delete');
    try {
        const deleteduser = await user.findByIdAndDelete(req.params.id);
        res.status(200).send(deleteduser);
    } catch (error) {
        res.status(500).send(error);
    }
  });

// Export the router
module.exports = router;
