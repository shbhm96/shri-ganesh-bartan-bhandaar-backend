import asyncHandler from "express-async-handler"
import User from "../models/usersModel.js";
import generateToken from "../utils/generateTokens.js";


//Fetch all Products
//GET /api/priducts
//No Token required public routes
const authUser = asyncHandler(async(req,res) => {    
    const {email,password} = req.body

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        return res.json({
            _id : user._id,
            name : user.name,
            email:user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id)
        })        
    }else{
        res.status(401)
        throw new Error ('Invalid email or password')
    }

    res.send({email,password})
})

const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)

    if(user ){
        res.json({
            _id : user._id,
            name : user.name,
            email:user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id)
        })        
    }else{
        res.status(404)
        throw new Error ('User Not Found')
    }

    res.send({email,password})
})

const createUser = asyncHandler(async(req,res) => {

    const {name, email,password,mobile} = req.body
    console.log(name,email,password,mobile)
    

    const userExist = await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error("User Already Exist")
    }
    const user = await User.create({
        name,
        email,
        password,
        //mobile
    })
    console.log("Create Use112r",user)
    if(user){
        res.status(201).json({
            _id : ''+user._id,
            name : ''+user.name.toString(),
            email:  ''+user.email.toString(),
          //  mobile : user.mobile,
            isAdmin : user.isAdmin,
            token : generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid User Data")
    }
    console.log("Create User8   `729")
})

const updateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)

    if(user ){
       user.name = req.body.name || user.name
       user.email = req.body.email || user.email      
       if(req.body.password){
        user.password = req.body.password
       }

       const updateUser = await user.save()

       res.json({
        _id : updateUser._id,
        name : updateUser.name,
        email:updateUser.email,
        isAdmin : updateUser.isAdmin,
        token : generateToken(updateUser._id)
    })
    }else{
        res.status(404)
        throw new Error ('User Not Found')
    }

    res.send({email,password})
})



export {authUser,getUserProfile,createUser,updateUserProfile}