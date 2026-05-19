const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, paymentController.getPayments);
router.get('/receipt/:id', paymentController.getPublicReceipt);
router.post('/', authMiddleware, paymentController.createPayment);
router.put('/:id', authMiddleware, paymentController.updatePayment);
router.delete('/:id', authMiddleware, paymentController.deletePayment);

module.exports = router;
