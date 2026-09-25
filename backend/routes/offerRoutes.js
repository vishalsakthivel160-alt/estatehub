const express = require('express');
const {
  createOffer, getMyOffers, getReceivedOffers, respondToOffer,
} = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('buyer'), createOffer);
router.get('/mine', protect, authorize('buyer'), getMyOffers);
router.get('/received', protect, authorize('seller'), getReceivedOffers);
router.put('/:id', protect, authorize('seller'), respondToOffer);

module.exports = router;
