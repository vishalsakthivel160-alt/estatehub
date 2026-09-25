const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    listingType: { type: String, enum: ['sale', 'rent'], required: true },
    propertyType: {
      type: String,
      enum: [
        'Apartment', 'House', 'Villa', 'Plot', 'Land',
        'Commercial', 'Office', 'Shop', 'Warehouse',
      ],
      required: true,
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    address: { type: String, required: true },
    area: { type: Number, required: true }, // in sq.ft
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

module.exports = mongoose.model('Property', propertySchema);
