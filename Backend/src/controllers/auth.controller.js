const userModel = require("../models/user.model");
const cookie = require("cookie-parser");
const bcrypt = require("../../node_modules/bcryptjs/umd");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");


/**
 * @name registerUserController
 * @desc register a new user, expects username, email, and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try{
        const {username, email, password} = req.body;

        if(!username  || !email || !password){
            return res.status(400).json({message: "username, email, and password are required"});
        }

        const isUserExist = await userModel.findOne({
            $or: [{username}, {email}]
        });

        if(isUserExist){
            return res.status(400).json({
                message: "Account already exists with this email or username"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {id: user._id, username: user.username },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.cookie("token", token);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    }catch(err){
        console.log(err);
    }

}
/**
 * 
 * @name loginUserController 
 * @decsription login a user, expects email and password in the request body 
 * @access public
 */
async function loginUserController(req, res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Invalid email or Password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token);

    res.status(200).json({
        message: "User loggedIn successfully",

        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
    
}

/**
 * 
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res){
    const token = req.cookies.token;

    if(token){
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * 
 * @name getMeControllere 
 * @description get the curr logged in user detail
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};