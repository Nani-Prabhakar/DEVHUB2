const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the input data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, gender } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("User with this email already exists.");
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new instance of the User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    });

    const savedUser=await user.save();
    const token=await savedUser.getJWT();

    res.cookie("token",token,{
      expires:new Date(Date.now()+8*3600000),
    });

    // Send a success response
    res.json({message:"user Added Successfully!", data:savedUser})
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Invalid Credentials!!");
      }
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
  
        res.send(user);
      } else {
        throw new Error("Invalid Credentials!!");
      }
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

  authRouter.post("/logout", async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // or false for localhost without HTTPS
      sameSite: "strict",
      path: "/",
    });
    res.status(200).send("Logout Successful!!");
  });
  

module.exports=authRouter;