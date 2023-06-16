import path from "path"
import express from "express"
import multer from "multer"
import { uploadFile } from "../config/s3.js"

const router = express.Router()
const upload = multer({ dest : "uploads/" })

router.post('/images',upload.single('image'),async(req,res)=>{
    console.log("Multer")
    const file = req.file
    console.log(file)
    const result = await uploadFile(file)
    console.log(result)
    const description = req.body.description
    res.send("OK")
})

export default router