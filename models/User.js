const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    userName: String,
    email: String,
    password: String,
    profilePic: String,
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
