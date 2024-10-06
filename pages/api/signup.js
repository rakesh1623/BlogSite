import user from "@/models/user"
import connectDb from "@/middleware/mongoose"
var CryptoJS = require("crypto-js");
const nodemailer = require('nodemailer');

const handler = async(req,res)=>{
    if(req.method=='POST'){

        const {name , email } = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000);
        let transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'rakeshranjan1623@gmail.com', 
                pass: 'yyef tqjc fall iixb'
            }
        });
        
        // Email options
        let mailOptions = {
            from: 'rakeshranjan1623@gmail.com',
            to: email, 
            subject: 'Your OTP Code for Blog Site', 
            text: `Your OTP is: <b>${otp}</b>`, 
            html: `<b>Your OTP : ${otp}</b>`
          };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                alert("There was a problem in sending OTP, please try again!")
            }
            // console.log('Email sent: ' + info.response);
        });


        let encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.JWT_SECRET).toString();
    let u = new user({
      name,
      email,
      password: encryptedPassword,
      otp, 
      otpExpiry: Date.now() + 10 * 60 * 1000 
    });
    
    await u.save();

        
        
    res.status(200).json({ success :true })
    }
    else{
        res.status(400).json({ error :"This is not allowed" })
    }

}

export default connectDb(handler)
  