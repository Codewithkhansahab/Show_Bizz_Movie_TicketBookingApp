import express from "express";
import { getFavorite, getUserBooking, updateFavorite } from "../controllers/userController.js";

const userRouter = express.Router();


userRouter.get('/bookings', getUserBooking )
userRouter.post('/update-favorite',updateFavorite)
userRouter.get('/favorites',getFavorite)

export default userRouter;