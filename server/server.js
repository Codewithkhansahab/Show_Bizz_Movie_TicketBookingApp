import express from "express"
import cors from "cors"
import { configDotenv } from "dotenv"
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { inngest,functions } from "./inngest/index.js";
import {serve} from "inngest/express"
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRouter.js";
import { stripeWebhooks } from "./controllers/stripeWebhook.js";

const app = express();
const port = 3000;

await connectDB()
// stripe route 

app.use('/api/stripe', express.raw({type: 'application/json'}),stripeWebhooks)

// middleware

app.use(express.json())

app.use(cors())
app.use(clerkMiddleware())

//API Routes

app.get('/' , (req,res) =>{
    res.send("Server is live")
})
app.use('/api/inngest', serve({client:inngest,functions}))
app.use('/api/show',showRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin' , adminRouter)
app.use('/api/user' , userRouter)

app.listen(port,()=>{
    console.log("Server started !!! 3000")
})