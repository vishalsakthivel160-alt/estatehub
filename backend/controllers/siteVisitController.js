const SiteVisit = require('../models/SiteVisit');
const Property = require('../models/Property');

// @desc Buyer requests a site visit
// @route POST /api/site-visits
const createSiteVisit = async (req, res) => {
  try {
    const { propertyId, date, time } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const visit = await SiteVisit.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.seller,
      date,
      time,
    });

    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get site visits requested by buyer
// @route GET /api/site-visits/mine
const getMySiteVisits = async (req, res) => {
  try {
    const visits = await SiteVisit.find({ buyer: req.user._id })
      .populate('property', 'title images')
      .populate('seller', 'name phone')
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get site visits received by seller
// @route GET /api/site-visits/received
const getReceivedSiteVisits = async (req, res) => {
  try {
    const visits = await SiteVisit.find({ seller: req.user._id })
      .populate('property', 'title images')
      .populate('buyer', 'name phone')
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Seller approves/rejects/reschedules a visit
// @route PUT /api/site-visits/:id
const respondToSiteVisit = async (req, res) => {
  try {
    const { status, date, time, note } = req.body;
    const visit = await SiteVisit.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Site visit not found' });
    if (visit.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) visit.status = status;
    if (date) visit.date = date;
    if (time) visit.time = time;
    if (note !== undefined) visit.note = note;

    await visit.save();
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSiteVisit, getMySiteVisits, getReceivedSiteVisits, respondToSiteVisit };
