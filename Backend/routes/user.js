const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const{ authenticateToken} = require("./userAuth")

 //signup
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check password length
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5" });
        }
         
       const hashPass = await bcrypt.hash(password,10)



        // Create and save new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address
        });
        
        await newUser.save();
        return res.status(200).json({ message: "Signup successfully" });

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//signin

router.post("/sign-in", async (req, res) => {
    try {
        const {username, password } = req.body;
        const existingUser = await User.findOne({username});
        if(!existingUser){
          res.status(400).json({massage:"Invelid credentials"})
        }

        await bcrypt.compare(password,existingUser.password,(err,data)=> {
            if(data) {
                const authclaims =[
                    {name:existingUser.username},
                    {role:existingUser.role}
                ]
                const token = jwt.sign({authclaims},"bookStore123",{
                expiresIn:"30d"
                })
                res.status(200).json({
                    id:existingUser._id,
                    role:existingUser.role,
                    token:token
                })
            }else {
                res.status(400).json({message: "Invelid credentials"})

            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get user information

router.get("/get-user-information",authenticateToken, async (req,res) => {
    try{
        const {id} = req.headers;
        const data = await User.findById(id) .select("-password");
        return res.status(200).json(data);
    }catch (error) {
     res.status(500).json({message: "Internal Server Erorr"})
    }
})

//update adresss
router.put("/update-address",authenticateToken, async (req,res) => {
    try{
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address: address});
        return res.status(200).json({message:"Address updated successfully"})
    }catch (error) {
     res.status(500).json({message: "Internal Server Erorr"})
    }
})


module.exports = router;
