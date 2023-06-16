import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
        length:10,
        default:0
    },
    password:{
        type:String,
        required:true

    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const hashPassword = await bcrypt.hashSync(this.password, 10);
      this.password = hashPassword;
    }
    return next();
  });
const User = mongoose.model("User",userSchema)

export default User