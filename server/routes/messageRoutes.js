import express from 'express';
import { imageMessageController, textMessageController } from '../controllers/messageController.js';
import { protect } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimit.js';

const messageRouter = express.Router()

messageRouter.post('/text', protect, apiLimiter, textMessageController)
messageRouter.post('/image', protect, apiLimiter, imageMessageController)

export default messageRouter