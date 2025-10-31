const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/PresensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { body } = require('express-validator');

// Middleware
router.use(addUserData);

// Routes
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// ✅ Tambahkan validasi di route PUT
router.put(
  '/:id',
  [
    body('checkIn')
      .optional()
      .isISO8601()
      .withMessage('❌ Format tanggal checkIn tidak valid. Gunakan format ISO 8601 (contoh: 2025-10-31T08:00:00Z)'),
    body('checkOut')
      .optional()
      .isISO8601()
      .withMessage('❌ Format tanggal checkOut tidak valid. Gunakan format ISO 8601 (contoh: 2025-10-31T17:00:00Z)'),
  ],
  presensiController.updatePresensi
);

router.delete('/:id', presensiController.deletePresensi);

module.exports = router;
