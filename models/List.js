const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema(
  {
    id_game: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    id_user: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('List', ListSchema);
