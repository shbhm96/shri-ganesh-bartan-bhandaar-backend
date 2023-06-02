import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";


//Fetch all Products
//GET /api/priducts
//No Token required public routes
const getProducts = asyncHandler(async(req,res) => {
    const products= await Product.find({}).select("-countInStock -createdAt -description -reviews -updatedAt -user");  
    return res.json(products)
})

const getProductById = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        return res.json(product)
    }
    res.status(404).json({message:"Product Not Found"});
})

export {getProductById,getProducts}