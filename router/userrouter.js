import express from "express";
import { handleSignup, handlelogin } from "../controller/user.js";
import user from "../model/User.js";
import Comment from "../model/comment.js";
import post from "../model/Post.js";
import multer from "multer";
import { userloggedin,authaccess } from "../middleware/userloggedin.js";
import { createComment, createPost } from "../controller/post.js";

const router=express.Router();
router.get("/",(req,res)=>{
    res.render("signup");
  
});

router.get("/home",async (req,res)=>{
    const posts= await post.find({});
    res.render("shoowpost",{
        user:req.user||null,
        posts
    });
});
router.get("/login",(req,res)=>{
    res.render("login");
});
router.get("/signup",(req,res)=>{
    res.render("signup");
});
router.get("/logout",(req,res)=>{
    res.clearCookie("uid").redirect("/login");
});

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images/')
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
})
const upload =multer({storage:storage});
    

router.get("/post",userloggedin, (req,res)=>{
   
    res.render("post",{
        user:req.user
    });
})
router.get("/allposts" ,authaccess,async (req,res)=>{
    const posts= await post.find({});
   // console.log(posts);
   console.log(req.user)
    res.render("shoowpost",
        {   user:req.user||null,
            posts:posts
        }
    )
})
router.get("/viewpost/:id",userloggedin,async (req,res)=>{
   // const id=req.params.id;
    
    const blog = await post.findById(req.params.id.trim()).populate('createdby');
    const Comments= await Comment.find({}).populate('commentedBy');
    req.blog=blog;
    res.render("blog",{
        user:req.user,
        blog,
        Comments
    })
  
})

router.post("/comment",userloggedin,createComment);



router.post("/post",upload.single('uploadFile'),userloggedin,createPost);
router.post("/signup",handleSignup);
router.post("/login",handlelogin);

export default router;