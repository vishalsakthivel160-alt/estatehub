const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('buyer'), addToWishlist);
router.get('/', protect, authorize('buyer'), getWishlist);
router.delete('/:propertyId', protect, authorize('buyer'), removeFromWishlist);

module.exports = router;
