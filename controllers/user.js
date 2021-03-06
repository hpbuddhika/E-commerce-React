const User = require("../models/user")
const jwt = require("jsonwebtoken") // to generate signed token
const expressJwt = require("express-jwt") // for authorization check


exports.signup = (req,res)=>{ 
    const user = new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err
            })
        }
        user.hassed_password = undefined;
        user.salt = undefined;

        res.json({
            user
        })
    })
}

exports.signin = (req,res)=>{

    //find the user bases on email
    const {email,password}= req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User with that email does not exist.Please signup"
            })
        }
        //if user is found make sure the email and password match
        //create authenticate method in User model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password don't match"
            });
        };

        //generate a signed token with user id 
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
        //persist the token as 't' in cookie with expiry date
        res.cookie('t',token,{expire:new Date()+9999})
        //return user and token to frontend client
        const {_id,name,email,role} = user;
        return res.json({token,user:{_id,email,name,role}});

    })

}

exports.signout = (req,res)=>{
    res.clearCookie('t');
    res.status(200).json({msg:"signout successful"});
}


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth",
});