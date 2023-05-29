import express from "express"
import { deleteProduct, deleteUserForAdmin, getAllUsersForAdmin, getUserById, updateUserById } from "../controller/adminController.js"
import {protectValidUser, isAdminUser } from "../middleware/authMiddleWare.js";

const router = express.Router()

router.get("/allusers",protectValidUser,isAdminUser,getAllUsersForAdmin)
router.delete("/deleteUser",protectValidUser,isAdminUser,deleteUserForAdmin)
router.get("/getUser/:id",protectValidUser,isAdminUser,getUserById)
router.get("/updateUser/:id",protectValidUser,isAdminUser,updateUserById)
router.get("/createProduct",protectValidUser,isAdminUser,)

router.delete("/deleteProduct/:id",protectValidUser,isAdminUser,deleteProduct)

export default router