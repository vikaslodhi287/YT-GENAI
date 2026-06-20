const userModel = require("./Backend/src/models/user.model");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "username, email, and password not found",
        });
    }

    const isUserExist = await userModel.findOne({
        $or : [
            {email}, {username}
        ]
    });

    if(isUserExist){
        return res.status(400).json({
            message: "Account already exists with this email ro username",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
    });
    
    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}
