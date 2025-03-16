import post from '../model/Post.js';
import express from 'express';
import multer from 'multer';
import Comment from '../model/comment.js';
import User from '../model/User.js'


export const createPost = async (req, res) => {
    const {title,content} = req.body;
    const filepath = req.file? req.file.path:null;
    const uploadFile = filepath.replace("public", "")
    if(!title || !content || !uploadFile){
        res.status(400).json({message:"All fields are required"});
    }
   // console.log(`inside create post ${req.user._id}`);
    const Post =await post.create({
        title,
        content,
        uploadFile,
        createdby:req.user._id,
    });

    res.status(201).json({ 
        message: "Successfully added", 
        post: Post 
    });


}

export const createComment=async(req,res)=>{
    const {content,blogId} =req.body;
    const user = await User.findById(req.user.id);
    //console.log("User ID when creating comment:", user);


    const new_comment= await Comment.create({
        content,
        commentedBy:user._id
    
    })

     const blog = await post.findById(blogId).populate('createdby');
     const Comments= await Comment.find({}).populate('commentedBy');
   

     return res.render('blog',{
        user:req.user,
        blog,
        Comments
    });

}