var express = require('express');
var router = express.Router();
var User = require("../models/User")
var auth = require("../middlewares/auth");

/* GET home page. */
router.get("/:username",auth.verifyToken,async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOne({ username })
        res.json({
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
            }
        })
    }
    catch (error){
        next(error)
    }
})
router.put('/:username',auth.verifyToken,async (req,res,next)=>{
    var username = req.params.username;
    try{
        var updatedUser =await User.findOneAndUpdate({username},req.body,{new: true})
        res.status(200).json({updatedUser})
    }
    catch (error){
        next(error)
    }
})

module.exports = router;