const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  id_game: { type: Number, required: true },
  background_image: { type: String, required: true },
  parent_platforms: { type: Array, required: true },
  name: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
