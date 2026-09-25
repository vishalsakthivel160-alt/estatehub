const User = require('../models/User');
const Property = require('../models/Property');
const Report = require('../models/Report');
const Enquiry = require('../models/Enquiry');
const Offer = require('../models/Offer');

// @desc Dashboard statistics
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalBuyers, totalSellers, totalProperties,
      pendingProperties, soldProperties, totalEnquiries, totalOffers, openReports] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        User.countDocuments({ role: 'buyer' }),
        User.countDocuments({ role: 'seller' }),
        Property.countDocuments(),
        Property.countDocuments({ status: 'pending' }),
        Property.countDocuments({ status: 'sold' }),
        Enquiry.countDocuments(),
        Offer.countDocuments(),
        Report.countDocuments({ status: 'open' }),
      ]);

    res.json({
      totalUsers, totalBuyers, totalSellers, totalProperties,
      pendingProperties, soldProperties, totalEnquiries, totalOffers, openReports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all users (buyers/sellers)
// @route GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Block/unblock a user
// @route PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a user
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all properties (any status)
// @route GET /api/admin/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve or reject a listing
// @route PUT /api/admin/properties/:id/status
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    property.status = status;
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a property
// @route DELETE /api/admin/properties/:id
const deletePropertyAdmin = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all reports
// @route GET /api/admin/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .populate('property', 'title')
      .populate('reportedUser', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update report status
// @route PUT /api/admin/reports/:id
const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.status = req.body.status || report.status;
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats, getUsers, toggleBlockUser, deleteUser,
  getAllProperties, updatePropertyStatus, deletePropertyAdmin,
  getReports, updateReportStatus,
};
