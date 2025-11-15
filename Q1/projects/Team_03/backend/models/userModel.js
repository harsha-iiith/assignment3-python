const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_classes: [
    {
      type: String,
    }
  ],
  joined_classes: [
    {
      type: String,
    }
  ]
});

module.exports = mongoose.model('User', userSchema); 