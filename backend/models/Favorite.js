const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Please provide a country ID to favorite'],
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);
