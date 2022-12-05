const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    userName: { type: String, index: { unique: true, dropDups: true } },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, defaut: '' },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
