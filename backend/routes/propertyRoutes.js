const express = require('express');
const {
  getProperties, getPropertyById, createProperty,
  updateProperty, deleteProperty, markAsSold, getMyProperties,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProperties);
router.get('/seller/mine', protect, authorize('seller'), getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('seller'), upload.array('images', 10), createProperty);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 10), updateProperty);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProperty);
router.put('/:id/sold', protect, authorize('seller'), markAsSold);

module.exports = router;
