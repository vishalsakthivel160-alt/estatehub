const express = require('express');
const {
  getStats, getUsers, toggleBlockUser, deleteUser,
  getAllProperties, updatePropertyStatus, deletePropertyAdmin,
  getReports, updateReportStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/properties', getAllProperties);
router.put('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deletePropertyAdmin);
router.get('/reports', getReports);
router.put('/reports/:id', updateReportStatus);

module.exports = router;
