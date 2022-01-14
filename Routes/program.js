const jwt = require("jsonwebtoken");
const router = require("express").Router();
const {getPrograms} = require("../Controllers/program.js");

require("dotenv").config();

router.get("/", authenticateToken,getPrograms);


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if(token == null){
        res.status(400).json("Unautherized User");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err,user)=>{
        if(err){
            return res.status(500).json("Unautherized User");
        } 
        req.user = user;
        next()
    })
}

module.exports = router;