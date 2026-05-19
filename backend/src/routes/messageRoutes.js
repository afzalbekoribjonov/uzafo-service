const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, messageController.getMessages);
router.post('/', messageController.createMessage); // Public for contact form
router.put('/:id/read', authMiddleware, messageController.markAsRead);
router.delete('/:id', authMiddleware, messageController.deleteMessage);

module.exports = router;
