import path from "path";
import { authaccess } from "./middleware/userloggedin.js";
import express, { urlencoded } from "express";
const app=express();

import mongoose, { mongo } from "mongoose";
import {userloggedin} from "./middleware/userloggedin.js"
mongoose.connect("mongodb://localhost:27017/blog");
mongoose.connection.on("connected",()=>{
    console.log("connected to database");
});
app.use(authaccess);
import cookieParser from "cookie-parser";
app.use(urlencoded({extended:false}));
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());


app.set('view engine','ejs');
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
import router from "./router/userrouter.js";



app.use(router);


app.use(express.static(path.resolve("./public")));
app.use(express.static("public"));





app.listen(3000,()=>{
    console.log("server started on port 3000");
});
