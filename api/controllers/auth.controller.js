import User from "../models/user.model.js";
// import { bcryptjs } from "bcryptjs";
// import pkg from 'bcryptjs';
// const { bcryptjs } = pkg;
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body;
    // we will get the info when the user logs in 
    const hashedPassword = bcrypt.hashSync(password,10);
    // this are the parameters used in our model if they are the same no need to write again but hashed is diff
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(201).json("User created Successfully")
    } catch (error) {
        next(error)
    }
}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body
    try {
        const validUser = await User.findOne({email:email})
        if(!validUser) return next(errorHandler(404,'User not found'))
        const validPassword = bcrypt.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials'))
            // creating a token for a cookie so that we can save the user info inside the browser
        // we are using _id to create a unique token because it is unique for every user and anyone cannot deduce anything from it 
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        // doing this because we don't want to send the password so we just extract the password
        const {password:pass,...rest} = validUser._doc
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


export const google = async(req,res,next)=>{
    try {
        // check if the user exist or not if it doesn't then create the user
        const user = await User.findOne({email:req.body.email})
        // if the user  exist we need to register the user so create a token and save it inside a cookie
        if(user){
            // console.log("WE are here")
            if (!user.avatar || user.avatar === "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png") {
                user.avatar = req.body.photo;
                console.log(req.body.photo)
                await user.save(); // Save the updated user object
              }
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password:pass,...rest} = user._doc
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
        else{
            // now for signing with google we don't need password so we will generate a random
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(generatePassword,10)
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo})
            console.log(req.body.photo)
            await newUser.save()
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password:pass,...rest} = newUser._doc
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}