import express from "express";
import { getProductById, getProducts } from "../controller/productController.js";


const router = express.Router()
router.get("/getProduct/:id",getProductById)
router.get("/",getProducts)



export default router