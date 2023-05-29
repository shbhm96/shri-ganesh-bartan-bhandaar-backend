import express from "express";

import productRoutes from "./routes/productsRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import adminRoutes from "./routes/adminRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"


const router = express.Router()

router.route('/',(req,res)=>{
    res.send("API is running....")
})

router.route("/api/test",(req,res)=>{
    res.send("TEST SUCCESSFULL")
})
router.route("/api/products",productRoutes)
router.route("/api/users",userRoutes)
router.route("/api/orders",orderRoutes)
router.route("/api/admin",adminRoutes)
router.route("/api/upload",uploadRoutes)

const __dirname = path.resolve()
router.use("/uploads",express.static(path.join(__dirname,'/uploads')))

app.use(notFound)

app.use(errorHandler)


export default router