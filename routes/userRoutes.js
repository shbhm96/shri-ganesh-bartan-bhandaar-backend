import express from "express";
import 
{ 
    authUser, 
    createUser, 
    getUserProfile, 
    updateUserProfile 
} from "../controller/userController.js";
import { protectValidUser } from "../middleware/authMiddleWare.js";

const router = express.Router()

router.post("/login",authUser)
router.get("/profile",protectValidUser,getUserProfile)
router.get("/profile/update",protectValidUser,updateUserProfile)
router.post("/",createUser)


export default router