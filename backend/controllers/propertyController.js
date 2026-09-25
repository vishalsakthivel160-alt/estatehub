const Property = require('../models/Property');

// @desc Get all approved properties with search/filter
// @route GET /api/properties
const getProperties = async (req, res) => {
  try {
    const {
      keyword, city, propertyType, listingType,
      minPrice, maxPrice, bedrooms, page = 1, limit = 12,
    } = req.query;

    const query = { status: 'approved' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('seller', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single property
// @route GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'seller', 'name email phone'
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create property (seller)
// @route POST /api/properties
const createProperty = async (req, res) => {
  try {
    const body = req.body;
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const property = await Property.create({
      title: body.title,
      description: body.description,
      price: body.price,
      listingType: body.listingType,
      propertyType: body.propertyType,
      location: {
        city: body.city,
        state: body.state,
      },
      address: body.address,
      area: body.area,
      bedrooms: body.bedrooms || 0,
      bathrooms: body.bathrooms || 0,
      amenities: body.amenities ? JSON.parse(body.amenities) : [],
      images,
      seller: req.user._id,
      status: 'pending',
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update property (seller owns it)
// @route PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    const body = req.body;
    const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);

    property.title = body.title || property.title;
    property.description = body.description || property.description;
    property.price = body.price || property.price;
    property.listingType = body.listingType || property.listingType;
    property.propertyType = body.propertyType || property.propertyType;
    if (body.city || body.state) {
      property.location = {
        city: body.city || property.location.city,
        state: body.state || property.location.state,
      };
    }
    property.address = body.address || property.address;
    property.area = body.area || property.area;
    property.bedrooms = body.bedrooms ?? property.bedrooms;
    property.bathrooms = body.bathrooms ?? property.bathrooms;
    if (body.amenities) property.amenities = JSON.parse(body.amenities);
    if (newImages.length) property.images = [...property.images, ...newImages];
    if (body.status && req.user.role === 'admin') property.status = body.status;

    const updated = await property.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete property
// @route DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark property as sold
// @route PUT /api/properties/:id/sold
const markAsSold = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    property.status = 'sold';
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get properties belonging to logged-in seller
// @route GET /api/properties/seller/mine
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  markAsSold,
  getMyProperties,
};
