import express from 'express';
import cookies from  'cookies';
import { getUser } from '../services/AuthService.js';
export  function userloggedin(req,res,next){
    const token=req.cookies?.uid;
    if(!token){
        return res.render("login");
    }   
    const user= getUser(token);
    console.log("User in userloggedin:", user); 

    if(!user){
        return res.render("login");
    }
    req.user=user;
    next();
}
export function authaccess(req, res, next) {
    const token = req.cookies?.uid; 
    if (token) {
        const user = getUser(token);

        if (user) {
            req.user = user; 
            res.locals.user = user; 
        } else {
            req.user = null;
        }
    } else {
        req.user = null;
    }

    console.log("User in authaccess middleware:", req.user);
    next();
}