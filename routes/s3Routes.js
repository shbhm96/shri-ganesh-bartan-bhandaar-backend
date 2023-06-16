import express from "express";
import 
{ 
    s3UploadImageUrl
} from "../controller/s3Controller.js";

const router = express.Router()

const upload = multer({dest:"uploads"})

router.route("/",upload.single("images"),s3UploadImageUrl)

export default router