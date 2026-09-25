const Report = require('../models/Report');

// @desc Logged-in user files a report against a property or user
// @route POST /api/reports
const createReport = async (req, res) => {
  try {
    const { propertyId, reportedUserId, reason } = req.body;
    const report = await Report.create({
      reportedBy: req.user._id,
      property: propertyId || null,
      reportedUser: reportedUserId || null,
      reason,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport };
