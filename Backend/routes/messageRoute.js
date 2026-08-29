import express from 'express';
import { sendMessage, getMessages, getConversations, markAsSeen, deleteMessage, deleteConversation } from '../controllers/messageController.js';
import userAuth from '../middelwares/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/send/:receiverId', userAuth, upload.single('attachment'), sendMessage);
router.get('/conversations', userAuth, getConversations);
router.put('/seen/:senderId', userAuth, markAsSeen);
router.delete('/message/:messageId', userAuth, deleteMessage);
router.delete('/conversation/:conversationId', userAuth, deleteConversation);
router.get('/:userId', userAuth, getMessages);

export default router;
