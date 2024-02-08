const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemRoutes = require('./server'); // Make sure the path is correct

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Use the routes after the middleware
app.use(itemRoutes);

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