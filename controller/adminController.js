import asyncHandler from "express-async-handler"
import User from "../models/usersModel.js";
import generateToken from "../utils/generateTokens.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";


const getAllUsersForAdmin = asyncHandler(async(req,res) => {
    const users = await User.find({})
    res.send(users)
})
const deleteUserForAdmin = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)
    console.log("user",user)
    if(user){
        await  user.deleteOne()
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

const createProduct = asyncHandler(async(req,res)=>{
    const {name,price,category,brand,countInStock,description,image,mrp} = req.body.productData
    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        brand,
        category,
        countInStock,
        rating:4,
        numReviews: 0,
        description,
        mrp
    })

    if(product){
        const createdProduct = await product.save()
        return res.status(201).json(createdProduct)
    }else{
        res.status(403)
        throw new Error("Product Can't be Created")
    }
    
})

const updateProduct = asyncHandler(async (req, res) => {
    const {
      _id,        
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      mrp,
    } = req.body.productData
      const updatedProduct = await Product.updateOne({_id},{
        $set:{
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
            mrp
        }
      })
    if(updateProduct){
          return res.json(updatedProduct)
    }else {
      res.status(404)
      throw new Error('Product not found')
    }
  })

  const deleteProduct = asyncHandler(async(req,res) => {
    const _id = req.params.id
    const result = await Product.deleteOne({_id})
    
    
    if(result){
        res.json({result})
    }else{
        res.status(404)
        throw new Error("Product Not Found")
    }
})

  const getAllOrders = asyncHandler(async(req,res)=>{
    const allOrders = await Order.find({$or:[{isPaid:false},{isDelivered:false}]})
    if(allOrders){
        return res.json(allOrders)
    }else{
        res.status(401)
        throw new Error('No Orders Exist')
    }
  })

  const amountPaid = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id)
    if(order){
        if(order.isPaid){
            res.status(301)
            throw new Error("Order Already Paid!!")
        }
        order.isPaid = true
        order.paidAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)

    }else{
        res.status(401)
        throw new Error("Order Not Found!!")
    }
  })

  const orderDelivered = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id)
    if(order){
        if(order.isDelivered){
            res.status(301)
            throw new Error("Order Already Delivered!!")
        }
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)

    }else{
        res.status(401)
        throw new Error("Order Not Found!!")
    }
  })

export {
    getAllUsersForAdmin,
    getAllOrders,
    deleteUserForAdmin,
    getUserById,
    updateUserById,
    deleteProduct,
    createProduct,
    updateProduct,
    amountPaid,
    orderDelivered
}