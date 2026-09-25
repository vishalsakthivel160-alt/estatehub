const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ buyer: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
