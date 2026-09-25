const express = require('express');
const {
  createSiteVisit, getMySiteVisits, getReceivedSiteVisits, respondToSiteVisit,
} = require('../controllers/siteVisitController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('buyer'), createSiteVisit);
router.get('/mine', protect, authorize('buyer'), getMySiteVisits);
router.get('/received', protect, authorize('seller'), getReceivedSiteVisits);
router.put('/:id', protect, authorize('seller'), respondToSiteVisit);

module.exports = router;
