const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

//@desc Register new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler (async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName || !lastName || !email || !password) {
        res.status(400)
        throw new Error('Please ass all fields')
    }

    //check if user exist
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User alresy exists')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            FirstName: user.firstName,
            LastName:  user.lastName,
            Email: user.email,
            Token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//@desc Authenticate a user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            FirstName: user.firstName,
            LastName:  user.lastName,
            Email: user.email,
            Token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

//@desc Get user data
//@route GET /api/users/me
//@access private
const getMe = asyncHandler (async (req, res) => {
    const {_id, firstName, lastName, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        firstName,
        lastName,
        email,
    })
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}