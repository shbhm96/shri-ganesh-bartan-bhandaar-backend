import express from "express"
import { 
    amountPaid, 
    createProduct, 
    deleteProduct, 
    deleteUserForAdmin, 
    getAllOrders, 
    getAllUsersForAdmin, 
    getUserById, 
    orderDelivered, 
    updateUserById 
} from "../controller/adminController.js"
import {protectValidUser, isAdminUser } from "../middleware/authMiddleWare.js";

const router = express.Router()

router.get("/allusers",protectValidUser,isAdminUser,getAllUsersForAdmin)
router.delete("/deleteUser/:id",protectValidUser,isAdminUser,deleteUserForAdmin)
router.get("/getUser/:id",protectValidUser,isAdminUser,getUserById)
router.get("/updateUser/:id",protectValidUser,isAdminUser,updateUserById)
router.post("/product/create",protectValidUser,isAdminUser,createProduct)
router.get("/getAllOrders",protectValidUser,isAdminUser,getAllOrders)
router.get("/order/paid/:id",protectValidUser,isAdminUser,amountPaid)
router.get("/order/delivered/:id",protectValidUser,isAdminUser,orderDelivered)



router.delete("/deleteProduct/:id",protectValidUser,isAdminUser,deleteProduct)

export default router