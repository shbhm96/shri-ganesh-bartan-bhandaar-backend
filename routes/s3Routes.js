import express from "express";
import {
    getImage,
    uploadImage
} from "../config/s3.js"
import multer from "multer";

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.route("/:key",getImage)

router.route("/",(req,res)=>{
    console.log("eHeub")
})

export default router