import mongoose from 'mongoose';
import { createHmac, randomBytes } from 'crypto';
import { setUser,getUser } from '../services/AuthService.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profilepicture: {
        type: String,
        default: " ",
    },
    salt: {
        type: String,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', function (next) {
    if (!this.isModified("password")) {  
        return next();
    }

    const salt = randomBytes(13).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    this.password = hashedPassword;
    this.salt = salt;

    next();
});


userSchema.statics.matchPasswordAndToken = async function (email, password) { 
    const user = await this.findOne({ email });
    if (!user) {
        return null; 
    }

    const { password: hashedPassword, salt } = user;
    if (!salt) {
        return null; 
    }
   //console.log(hashedPassword);
    const providedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== providedHash) {
        throw new Error("Incorrect Password");
    }
    const token=setUser(user);
    console.log(`token inside your mathpassword ${token}`);
    return token; 
};

const user = mongoose.model("User", userSchema);
export default user;
