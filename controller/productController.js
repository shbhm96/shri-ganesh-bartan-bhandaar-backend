// import { getImageUrlS3 } from "../config/s3.js";
import Product from "../models/productModel.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

//Fetch all Products
//GET /api/priducts
//No Token required public routes
const getProducts = asyncHandler(async(req,res) => {
    const products= await Product.find().select("-countInStock -createdAt -description -reviews -updatedAt -user");  

    for (const product of products) {
        const getObjectParams = {
            Bucket: bucketName,
            Key: product.image
        }

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3,command,{ expiresIn : 3600})
        product.image = url
    }
    return res.json(products)
})

const getProductById = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id).select("-updatedAt -createdAt -user")
    
    const getObjectParams = {
        Bucket: bucketName,
        Key: product.image
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3,command,{ expiresIn : 3600})
    product.image = url
    if(product){
        return res.json(product)
    }else{
        res.status(404)
        throw new Error("Product Not Found")
    }
})

export {getProductById,getProducts}