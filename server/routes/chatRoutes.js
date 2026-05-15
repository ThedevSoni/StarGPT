import express from 'express';
import { createChat, getChats, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';
import { chatLimiter } from '../middlewares/rateLimit.js';

const chatRouter = express.Router();

chatRouter.get('/create', protect, chatLimiter, createChat);
chatRouter.get('/get', protect, getChats);
chatRouter.post('/delete', protect, deleteChat);

export default chatRouter;