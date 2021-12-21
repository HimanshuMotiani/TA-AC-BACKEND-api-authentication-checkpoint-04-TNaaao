var express = require('express');
var router = express.Router();
var User = require("../models/User")
var auth = require("../middlewares/auth")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register
router.post("/register", async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    let token = await user.signToken();
    res.json({ user: await user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//login
router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email/Password required!" });
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Email is not registered" });
    let result = await user.verifyPassword(password);
    if (!result)
      return res.status(400).json({ error: "Password is invalid" });
    let token = await user.signToken();
    res.json({ user: await user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.get('/current-user',auth.verifyToken,async (req,res,next)=>{
  try{
      var user =await User.findById(req.user.userId)
      res.status(200).json({user:{
          email:user.email,
          username:user.username,
          bio:user.bio,
          image:user.image,
      }})
  }
  catch (error){
      next(error)
  }
})

router.post("/:username/follow", auth.verifyToken, async (req, res, next) => {
  var username = req.params.username;
  try {
    var user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ error: "User not available" })
    }
    var followers = await User.findByIdAndUpdate(user.id, {
      $push: {
        followers: req.user.userId
      }
    })
    var currentUser = await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        following: user.id
      }
    })
    res.json({followers,currentUser})

  }
  catch (error) {
    next(error)
  }
})

router.delete("/:username/follow",auth.verifyToken, async (req, res, next) => {
  var username = req.params.username;
  console.log(req.user.userId);
  try {
      var userToUnfollow = await User.findOne({ username })
      if(!userToUnfollow){
          return res.status(404).json({error:"User not available"})
      }
      var followers =await User.findByIdAndUpdate(userToUnfollow.id,{$pull:{
          followers:req.user.userId
      }})
      var currentUser =await User.findByIdAndUpdate(req.user.userId,{$pull:{
          following:userToUnfollow.id
      }})
      res.json({
          profile: {
              username: currentUser.username,
              bio: currentUser.bio,
              image: currentUser.image,
              following: currentUser.following,
          }
      })
  }
  catch (error){
      next(error)
  }
})


module.exports = router;