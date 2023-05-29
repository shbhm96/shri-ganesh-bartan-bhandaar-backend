import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors"
import users from "./data/user.js";
import products from "./data/products.js";
import User from "./models/usersModel.js";
import Order from "./models/orderModel.js"
import Product from "./models/productModel.js"
import connectDB from "./config/database.js";


dotenv.config()

connectDB()

const importData = async () => {
    try{
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUser = await User.insertMany(users)
        const adminUser = createdUser[0]._id

        const sampleProduct = products.map(product=>{
            return{...product,user:adminUser}
        })

        await Product.insertMany(sampleProduct)

        console.log("Data Imported".green.inverse)
        process.exit()

    }catch(error){
        console.error(`${error}`.red.bold)
    }
}

const destroyData = async () => {
    try{
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log("Data Destroyed".red.inverse)
        process.exit()

    }catch(error){
        console.error(`${error}`.red.bold)
        process.exit(1)
    }
}

if(process.argv[2]==="-d"){
    destroyData()
}else{
    importData()
}
