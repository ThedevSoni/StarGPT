import express from 'express';
import { getPlans, PurchasePlan } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';
const creditRouter = express.Router()
creditRouter.get('/plan',getPlans)
creditRouter.post('/purchase',protect,PurchasePlan)
export default creditRouter