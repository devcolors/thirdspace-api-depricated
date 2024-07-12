const express = require('express');
const router = express.Router();
const user = require('./user'); // Adjust this to the correct path of your model
const {pictureUpload, videoUpload, upload} = require('../multimedia/multerstorage')
const mongoose = require('mongoose');

// --------- GET ---------

// Get posts for a specific user
router.get('/users/:id/posts', async (req, res) => {
  console.log('getting posts for user ' + req.params.id);
  console.log('form data:\n', req.body);
  try {
    const userFound = await user.findById(req.params.id);
    if (!userFound) {
      return res.status(404).send('User not found');
    }
    if (userFound.posts) {
      res.send(userFound.posts);
    } else {
      res.send([])
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// Get a specific post for a specific user
router.get('/users/:id/posts/:postid', async (req, res) => {
  console.log('getting posts for user ' + req.params.id);
  console.log('form data:\n', req.body);
  try {
    const userFound = await user.findById(req.params.id);
    if (!userFound) {
      return res.status(404).send('User not found');
    }
    if (userFound.posts) {
      res.send(userFound.posts.filter(post => {
        return post && (post.id == req.params.postid)
      }))
    } else {
      res.status(404).send('user has no posts');
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// Get all users
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

// Get a specific user
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

// --------- POST ---------

// Create a new user
router.post('/users', async (req, res) => {
  console.log('create new user');
  try {
      const newuser = new user(req.body);
      await newuser.save();
      res.status(201).send(newuser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new image post for a specific user
router.post('/users/:id/post-image', pictureUpload.single('imageFile'), async (req, res) => {
  console.log('creating image post');
  console.log('form data:\n', req.body);
  try {
    const userFound = await user.findById(req.params.id);
    if (!userFound) {
      return res.status(404).send('User not found');
    }

    console.log("file: ", req.file ? req.file.id : "no file")
    console.log("text:", req.body.text ? req.body.text : "no text")
    
    const post = {
      text: req.body.text ? req.body.text : null,
      imageFile: req.file ? new mongoose.Types.ObjectId(req.file.id) : null,
      id: Date.now().toString()
    }

    userFound.posts = [...userFound.posts, post]
    await userFound.save();
    
    res.status(200).send(post);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// Create a new video post for a specific user
router.post('/users/:id/post-video', videoUpload.single('videoFile'), async (req, res) => {
  console.log('creating video post');
  console.log('form data:\n', req.body);
  try {
    const userFound = await user.findById(req.params.id);
    if (!userFound) {
      return res.status(404).send('User not found');
    }

    console.log("file: ", req.file ? req.file.id : "no file")
    console.log("text:", req.body.text ? req.body.text : "no text")
    
    const post = {
      text: req.body.text ? req.body.text : null,
      videoFile: req.file ? new mongoose.Types.ObjectId(req.file.id) : null,
      id: Date.now().toString()
    }

    userFound.posts = [...userFound.posts, post]
    await userFound.save();
    
    res.status(200).send(post);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// Create a new image post for a specific user
router.post('/users/:id/post-media', upload.array('files', 10), async (req, res) => {
  console.log('creating media posts');
  console.log('form data:\n', req.body);
  try {
    const userFound = await user.findById(req.params.id);
    if (!userFound) {
      return res.status(404).send('User not found');
    }

    const imageFiles = req.files ? req.files.filter(file => file.mimetype.startsWith('image')) : []
    const videoFiles = req.files ? req.files.filter(file => file.mimetype.startsWith('video')) : []

    console.log("file ids: ", req.files ? req.files.map(file => file.id) : "no file")
    console.log("text:", req.body.text ? req.body.text : "no text")
    
    const post = {
      text: req.body.text ? req.body.text : null,
      imageFiles: imageFiles.map(file => new mongoose.Types.ObjectId(file.id)),
      videoFiles: videoFiles.map(file => new mongoose.Types.ObjectId(file.id)),
      id: Date.now().toString()
    }

    userFound.posts = [...userFound.posts, post]
    await userFound.save();
    
    res.status(200).send(post);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// Create a bunch of users
router.post('/users/bulk-create', async (req, res) => {
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

// --------- PATCH ---------

// Update a user
router.patch('/users/:id', async (req, res) => {
  console.log('update');
  try {
    const updateduser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updateduser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Set a profile picture for a specific user
router.patch('/users/:id/profile-picture', pictureUpload.single('profilePicture'), async (req, res) => {
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

// --------- DELETE ---------

// Delete a specific user
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
