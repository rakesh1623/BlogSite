// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import user from "@/models/user"
import connectDb from "@/middleware/mongoose"
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');


const handler = async(req,res)=>{

    console.log("yaha tak");
    if(req.method=='POST'){
        let u = await user.findOne({"email": req.body.email}) 
        console.log(u);
        if(u){

            var bytes  = CryptoJS.AES.decrypt(u.password, 'rakesh123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
        if(req.body.email == u.email && req.body.password == originalText){

            var token = jwt.sign({ name:u.email}, 'jwtsecret');
            res.status(200).json({ success :true, token })
        }
        else{

            res.status(400).json({ error :"This is not allowed" })
        }
    }else{

        res.status(400).json({ error :"This is not allowed" })
    }
        
    }
    else{
        res.status(400).json({ error :"This is not allowed" })
    }

}

export default connectDb(handler)
  