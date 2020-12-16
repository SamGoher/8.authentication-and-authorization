// application requirements
const mongoose = require(`mongoose`);

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 15,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date
});

// user model
const User = mongoose.model(`users`, userSchema);

module.exports = User;