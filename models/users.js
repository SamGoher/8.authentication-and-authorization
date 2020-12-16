// application requirements
const mongoose = require(`mongoose`);
const jwt = require(`jsonwebtoken`);

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

// gerating jwt token for user
userSchema.methods.generateJwtToken = function () {
  const token = jwt.sign({
    userId: this._id,
    email: this.email
  }, process.env.JWT_SECRET, {
    expiresIn: `30d`
  });
  return token;
};

// user model
const User = mongoose.model(`users`, userSchema);

module.exports = User;