import express from "express"
import { createBookig, getOccupiedSeats } from "../controllers/bookingController.js"
 
const bookingRouter = express.Router()

bookingRouter.post('/create',createBookig)
bookingRouter.get('/seats/:showId',getOccupiedSeats)


export default bookingRouter;