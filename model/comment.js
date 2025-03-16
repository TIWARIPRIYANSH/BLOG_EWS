import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({

    content:{
        type:String,
        require:true
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

const Comment=mongoose.model('Comment',CommentSchema);
export default Comment;