var bcrypt = require("bcryptjs");
const User = require("../Models/userModel.js");
const jwt = require("jsonwebtoken");

require("dotenv").config();

var refreshTokenList = [];

const signup = async (req, res) => {
    try{

        const {name, email, password} = req.body;

        if(!(name && email && password)){
            res.status(400).json("Empty Field");
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
          res.status(409).send("User Already Exist. Please Login");
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);
    
        const newUser = await User.create({name: name, email: email, password: hashed_password});    
        const user = await newUser.save();

        const token = jwt.sign({name: user.name, email: user.email}, process.env.ACCESS_TOKEN);

        res.status(200).json({name: user.name, email: user.email, token:token});
    }
    catch(err){
        res.status(500).json("Something Went Wrong!");
    }
}
const login = async (req, res) => {
    try{

        const {email, password} = req.body;

        if(!(email && password)){
            res.status(400).json("Empty Field");
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign({name: user.name, email: user.email}, process.env.ACCESS_TOKEN, {expiresIn: '30m'});
            const refreshToken = jwt.sign({name: user.name, email: user.email}, process.env.REFRESH_TOKEN);
            refreshTokenList.push(refreshToken);
            res.status(200).json({accessToken: accessToken, refreshToken : refreshToken});
        }

        else{
            res.status(400).json("Unautherized User");
        }
        
    }
    catch(err){
        res.status(500).json("Something Went Wrong!");
    }
}

const logout = (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null){
        return res.status(400).json("Empty Field");
    }

    refreshTokenList = refreshTokenList.filter(token => token !== refreshToken);

    res.status(200).json("Successfully Loged Out");
}

const generateAccessToken = (req, res) => {
    const refreshToken = req.body.token;
    
    if(refreshToken == null){
        return res.status(400).json("Empty Field");
    }
    if(!refreshTokenList.includes(refreshToken)){
        return res.status(400).json("Unauthorized User");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err,user)=>{
        if(err){
            return res.status(500).json("Something Went Wrong!");
        } 
        const accessToken = jwt.sign({name: user.name, email: user.email}, process.env.ACCESS_TOKEN, {expiresIn: '30m'});
        res.status(200).json({accessToken: accessToken});
    })
}


module.exports = {signup, login, logout, generateAccessToken};