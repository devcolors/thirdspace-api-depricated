const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name: String,
password: String,
posts: Array,
bio: String,
profilePicture: mongoose.Schema.Types.ObjectId
// Add other fields as needed
});
  
module.exports = mongoose.model('user', userSchema);