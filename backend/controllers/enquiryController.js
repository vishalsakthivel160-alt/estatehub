const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

// @desc Buyer sends enquiry for a property
// @route POST /api/enquiries
const createEnquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const enquiry = await Enquiry.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.seller,
      message,
    });

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get enquiries made by logged-in buyer
// @route GET /api/enquiries/mine
const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ buyer: req.user._id })
      .populate('property', 'title images price')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get enquiries received by logged-in seller
// @route GET /api/enquiries/received
const getReceivedEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ seller: req.user._id })
      .populate('property', 'title images price')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update enquiry status (seller)
// @route PUT /api/enquiries/:id
const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    if (enquiry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    enquiry.status = req.body.status || enquiry.status;
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEnquiry, getMyEnquiries, getReceivedEnquiries, updateEnquiryStatus };
