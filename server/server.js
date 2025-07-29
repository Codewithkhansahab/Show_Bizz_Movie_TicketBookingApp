import express from "express"
import cors from "cors"
import { configDotenv } from "dotenv"
import connectDB from "./config/db.js";
import { clerkMiddleware, Client } from '@clerk/express'
import { inngest,functions } from "./inngest/index.js";
import {serve} from "inngest/express"

const app = express();
const port = 3000;

await connectDB()

// middleware

app.use(express.json())

app.use(cors())
app.use(clerkMiddleware())

//API Routes

app.get('/' , (req,res) =>{
    res.send("Server is live")
})
app.use('/api/inngest',serve({Client : inngest,functions}))

app.listen(port,()=>{
    console.log("Server started !!! 3000 ")
})