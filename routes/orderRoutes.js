import express from "express";
import { 
    addOrderItems, 
    getLoggedInUserOrders, 
    getOrderById, 
    updateOrderToPaid 
} from "../controller/orderController.js";
import { protectValidUser } from "../middleware/authMiddleWare.js";

const router = express.Router()

router.get("/myorders",protectValidUser,getLoggedInUserOrders)

router.get("/getOrder/:id",protectValidUser,getOrderById)
router.put("/:id/pay",protectValidUser,updateOrderToPaid)
router.post("/",protectValidUser,addOrderItems)



export default router