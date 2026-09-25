const express = require('express');
const {
  createEnquiry, getMyEnquiries, getReceivedEnquiries, updateEnquiryStatus,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('buyer'), createEnquiry);
router.get('/mine', protect, authorize('buyer'), getMyEnquiries);
router.get('/received', protect, authorize('seller'), getReceivedEnquiries);
router.put('/:id', protect, authorize('seller'), updateEnquiryStatus);

module.exports = router;
