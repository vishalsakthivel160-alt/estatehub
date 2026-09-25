const Wishlist = require('../models/Wishlist');

// @desc Add property to wishlist
// @route POST /api/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const exists = await Wishlist.findOne({ buyer: req.user._id, property: propertyId });
    if (exists) return res.status(400).json({ message: 'Already in wishlist' });

    const item = await Wishlist.create({ buyer: req.user._id, property: propertyId });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in buyer's wishlist
// @route GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ buyer: req.user._id }).populate({
      path: 'property',
      populate: { path: 'seller', select: 'name phone' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove property from wishlist
// @route DELETE /api/wishlist/:propertyId
const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      buyer: req.user._id,
      property: req.params.propertyId,
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
