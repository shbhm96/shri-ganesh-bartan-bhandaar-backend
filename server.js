import path from "path"
import express from 'express';
import dotenv from "dotenv";
import connectMongooseDB from './config/database.js';
import colors from 'colors';
import productRoutes from "./routes/productsRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import adminRoutes from "./routes/adminRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import cors from 'cors'
import morgan from "morgan";
import multer from "multer";
import { uploadFile,getFileStream } from "./config/s3.js";


dotenv.config()

connectMongooseDB()

const app = express()

app.use(express.json())

app.use(cors())

if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"))
}
    

app.use("/api/test",(req,res)=>{
    res.send("TEST SUCCESSFULL")
})
app.use("/api/products",productRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/admin",adminRoutes)


const upload = multer({dest:"uploads"})

app.get("/images/:key",(req,res)=>{
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
})

app.use("/api/images",upload.single("image"),async(req,res)=>{
    const file = req.file
    const result = await uploadFile(file)
    console.log(result)
    const description = req.body.description
    res.send({imagePath:`/images/${result.Key}`})
})


//saving images in S3 buckets
// app.use("/s3Url",s3Routes)

const __dirname = path.resolve()
app.use("/uploads",express.static(path.join(__dirname,'/uploads')))

if(process.env.NODE_ENV==="development"){
    app.use(express.static(path.join(__dirname,"/build")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"build","index.html"))
    })
}else{
    app.get("/",(req,res)=>{
        res.send("API is running")
    })
}

app.use(notFound)

app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT,
    console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`.cyan.bold)
    )