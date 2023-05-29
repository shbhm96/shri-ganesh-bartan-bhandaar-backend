import path from "path"
import express from 'express';
import dotenv from "dotenv";
import connectMongooseDB from '../config/database.js';
import colors from 'colors';
import rootRouter from "../routes/rootRouters.js"
import cors from 'cors'
import serverless from "serverless-http"

dotenv.config()

connectMongooseDB()

const app = express()

app.use("/.netlify/functions/api",rootRouter)

app.use(express.json())

app.use(cors())

// const openSSl = process.env.NODE_OPTION

const PORT = process.env.PORT || 5000
app.listen(PORT,
    console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`.cyan.bold)
    )

export default serverless(app)