import express from 'express';
import  user  from '../model/User.js';
import cookies from 'cookies';

import { setUser,getUser } from '../services/AuthService.js';


export async function  handleSignup(req,res){
    const {username,password,email,profilepicture} = req.body;
    if(!username || !password || !email){
        res.status(400).json({message:"All fields are required"});
    }
    const User = await user.create({
        username,
        password,
        email,
        profilepicture
    })
    res.render("login");
 }


 export async function handlelogin(req, res) {
    const { email, password } = req.body;

    try {
        
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.render("login", { error: "User not found" });
        }

        
        const token = await user.matchPasswordAndToken(email,password);
        
        if (!token) {
            return res.render("login", { error: "Invalid password" });
        }
        console.log(`tokken in user ${token}`);
        req.user=existingUser;
        
        res.cookie("uid", token)  
        console.log("Cookies After Setting JWT:", req.cookies);  
        res.redirect("/home");

    } catch (error) {
        console.error("Login Error:", error);
        res.render("login", { error: "Invalid email or Password" });
    }
}
