import asyncHandler from "express-async-handler"
import User from "../models/usersModel.js";
import generateToken from "../utils/generateTokens.js";
import Product from "../models/productModel.js";


const getAllUsersForAdmin = asyncHandler(async(req,res) => {
    const users = await User.find({})
    res.send(users)
})
const deleteUserForAdmin = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)

    if(user){
        await user.remove()
        res.json({message:"User removed"})
    }else{
        res.status(404)
        throw new Error("User Not Found")
    }
})


const getUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password")
    if(user){
        res.json(user)
    }else{
        res.status(404)
        throw new Error("User Not Found")
    }
})


const updateUserById = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password")
    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin =req.body.isAdmin || user.isAdmin

        const updatedUser = await user.save()
        res.json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin
        })
    }else{
        res.status(404)
        throw new Error("User Not Found")
    }
})

const deleteProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id)

    if(product){
        await product.remove()
        res.json({message : "Product Removed"})
    }else{
        res.status(404)
        throw new Error("Product Not Found")
    }
    res.json(product)
})

const createProduct = asyncHandler(async(req,res)=>{
    console.log(req.body)
    return
})
export {getAllUsersForAdmin,deleteUserForAdmin,getUserById,updateUserById,deleteProduct,createProduct}