import asyncHandler from "express-async-handler"
import {generateUploadURL} from "../config/s3.js"


export const s3UploadImageUrl = asyncHandler(async(req,res)=>{
    const {url} = await generateUploadURL()
    res.send({url})
})

export const s3UploadImage = asyncHandler(async(req,res)=>{
    const file = req.file
    const result = await uploadFile(file)
    console.log(result)
    const description = req.body.description
    res.send({imagePath:`/images/${result.Key}`})
})