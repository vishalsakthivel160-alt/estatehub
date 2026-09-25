const Offer = require('../models/Offer');
const Property = require('../models/Property');

// @desc Buyer makes an offer
// @route POST /api/offers
const createOffer = async (req, res) => {
  try {
    const { propertyId, amount, message } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const offer = await Offer.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.seller,
      amount,
      message,
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get offers made by buyer
// @route GET /api/offers/mine
const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ buyer: req.user._id })
      .populate('property', 'title images price')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get offers received by seller
// @route GET /api/offers/received
const getReceivedOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ seller: req.user._id })
      .populate('property', 'title images price')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Seller accepts/rejects/counters an offer
// @route PUT /api/offers/:id
const respondToOffer = async (req, res) => {
  try {
    const { action, counterAmount } = req.body; // action: accept | reject | counter
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (offer.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (action === 'accept') offer.status = 'accepted';
    else if (action === 'reject') offer.status = 'rejected';
    else if (action === 'counter') {
      offer.status = 'countered';
      offer.counterAmount = counterAmount;
    }

    await offer.save();
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOffer, getMyOffers, getReceivedOffers, respondToOffer };
