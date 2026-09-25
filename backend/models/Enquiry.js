const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'responded', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
