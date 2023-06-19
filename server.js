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
import cors from 'cors'
import morgan from "morgan";
import multer from "multer";
import { PutObjectCommand, S3Client,GetObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"
import sharp from "sharp";



dotenv.config()

connectMongooseDB()

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use("/images",express.static("images"))

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

const storage = multer.memoryStorage()
const upload = multer({storage:storage})
const randomImageName = (bytes = 32) => 
{
    return crypto.randomBytes(bytes).toString('hex')
}

const bucketRegion = process.env.AWS_S3_BUCKET_REGION
const bucketName = process.env.AWS_S3_BUCKET_NAME
const accessKey = process.env.AWS_S3_ACCESS_KEY
const secretKey = process.env.AWS_S3_SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey:secretKey
    },
    region:bucketRegion
})


app.use("/api/images",upload.single("image"),async(req,res)=>{
    const file = req.file
    console.log(req.body)
    console.log(req.file)
    //resize image
    const buffer = await sharp(req.file.buffer).resize({height : 1920,width:1080,fit:"contain"}).toBuffer()


    const imageName = randomImageName()

    const params ={
        Bucket : bucketName,
        Key : imageName,
        Body : buffer,
        ContentType : req.file.mimetype
    }

    const command =  new PutObjectCommand(params)  

    const imageUploadData = await s3.send(command)
    console.log(imageUploadData)
    if(imageUploadData){
        return res.json({
            imageUrl : imageName
        })
    }else{
        res.status(402)
        throw new Error("Can't Upload Image")
    }        
})

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