import jwt from 'jsonwebtoken';
const secret="6392@";

export  function setUser(user){
    return jwt.sign(
        {id:user._id,email:user.email},
        secret);
}

export function  getUser(token){
    try{
        return  jwt.verify(token,secret)
     }
     catch(error){
        return null;
     }
}

