import express from "express"
import { getPublishedImage, getUser, loginUser, registerUser } from "../controllers/userController.js";
const userRouter = express.Router();
import {protect} from "../middlewares/auth.js";


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect,  getUser)
userRouter.get('/published-images', getPublishedImage)

export default userRouter;