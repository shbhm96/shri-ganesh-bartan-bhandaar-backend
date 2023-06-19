import { S3Client,GetObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import dotenv from "dotenv";
import asyncHandler from "express-async-handler"

dotenv.config()

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



const getImageUrlS3 = asyncHandler(async(imageUrl)=>{
    
    const getObjectParams = {
        Bucket: bucketName,
        Key: imageUrl
    }
    
    const command = new GetObjectCommand(getObjectParams)
    getSignedUrl(s3,command,{expiresIn:3600}).then((result=>result)).then(data=>{
        return data
    })
})

export {getImageUrlS3}