const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemRoutes = require('./user/userRoutes'); // Make sure the path is correct
const multiMediaRoutes = require('./multimedia/multiMediaRoutes'); // Make sure the path is correct

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); //application/x-www-form-urlencoded 


// Use the routes after the middleware
app.use(itemRoutes);
app.use(multiMediaRoutes);

// MongoDB Connection (Replace with your own URI)
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
  

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the CRUD API!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app