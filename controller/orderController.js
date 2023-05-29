import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js";

//Create new Order
//POT /api/priducts
//Token required private routes

const addOrderItems = asyncHandler(async(req,res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        itemsPrice,
        shippingPrice,
        totalPrice
    } = req.body
    console.log("order body:",req.body)
    if(orderItems && orderItems.length == 0){
        res.send(400)
        throw new Error("No Order Items")
    }else{
        const order = new Order({
        orderItems,
        user:req.user._id,
        shippingAddress,
        paymentMethod,
        taxPrice,
        itemsPrice,
        shippingPrice,
        totalPrice
        })
        const createdOrder= await order.save()
        res.status(201).json(createdOrder)
    }
})

const getOrderById = asyncHandler(async(req,res) => {

    const order = await Order.findById(req.params.id).populate('user').select("-password")

    if(order){
        res.status(201).json(order)
    }else{
        res.status(401)
        throw new Error('Order Not Found')
    }    
})


const updateOrderToPaid = asyncHandler(async(req,res) => {

    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id          :   req.body.id,
            status      :   req.body.status,
            update_time :   req.body.update_time,
            email_address:  req.body.payer.email_address
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }else{
        res.status(401)
        throw new Error('Order Not Found')
    }    
})

const getLoggedInUserOrders = asyncHandler(async(req,res) => {

    const orders = await Order.find({user : req.user._id})
    if(orders){
        return res.json(orders)

    }else{
        res.status(401)
        throw new Error('Order Not Found')
    }   
})

export {addOrderItems,getOrderById,updateOrderToPaid,getLoggedInUserOrders}