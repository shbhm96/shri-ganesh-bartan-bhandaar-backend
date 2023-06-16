// import aws from "aws-sdk";
// import crypto from "crypto";
// import dotenv from "dotenv"
// import { promisify } from "util";

// dotenv.config()

// const region = process.env.REGION
// const bucketName = process.env.BUCKET_NAME
// const accessKeyId = process.env.ACCESS_KEY_ID
// const secretAccessKey =process.env.SECRET_ACCESS_KEY


// const s3 = new aws.S3({
//     region,
//     accessKeyId,
//     secretAccessKey,
//     signatureVersion:"v4"
// })

// const randomBytesString =  promisify(crypto.randomBytes)

// export const generateUploadURL = async() =>{
//     const rawBytes = await randomBytesString(16)
//     const imageName = rawBytes.toString("hex")

//     const params = ({
//         Bucket : bucketName,
//         Key : imageName,
//         Expires : 60
//     })

//     const uploadUrl = await s3.getSignedUrlPromise("putObject",params)
//     return uploadUrl
// }

import S3 from "aws-sdk/clients/s3.js"
import dotenv from "dotenv"
import fs from "fs"
dotenv.config()

const bucketName = process.env.AWS_BUCKET_REGION 
const region = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY 
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY 

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
})


//uploads a file to s3
const uploadFile = (file) =>{
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket : bucketName,
        Body : fileStream,
        Key : file.filename
    }

    return s3.upload(uploadParams).promise()
}

//download  file from s3

const getFileStream = (fileKey) => {
    const downParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downParams).createReadStream()
}

export {uploadFile,getFileStream}