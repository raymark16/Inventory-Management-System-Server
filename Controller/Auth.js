const Auth = require('../Models/Auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const path = require('path')

const registerUser = asyncHandler(async (req, res) => {
    if (req.files === null) {
        res.status(400)
        throw new Error('No File')
    }
    const { username, email, password, phone } = req.body
    const file = req.files.profilePicture

    if (!username || !email || !password || !phone) {
        res.status(400)
        throw new Error('All fields are required')
    }
    const userExist = await Auth.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('Email already taken')
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    const user = await Auth.create({
        username,
        email,
        password: hashedPassword,
        phone,
        userPicture: file.name,

    })
    if (user) { //created
        file.mv(path.join(__dirname, '..', 'public', 'Uploads', `${user._id}_${file.name}`), err => {
            if (err) {
                res.status(400)
                throw new Error("Can't upload file")
            }
        })
        return res.status(200).json('New User Created');
    } else {
        res.status(400).json({ message: `Invalid user data received` })
    }

})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error('All fields are required')
    }
    const user = await Auth.findOne({ email })

    if (!user) {
        res.status(400)
        throw new Error('No existing User')
    }
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password,
    );
    if (!isPasswordCorrect) {
        res.status(400)
        throw new Error('Email or Password is incorrect')
    }
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        userPicture: user.userPicture,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return res
        .cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })
        .status(200)
        .json({ message: 'login success' });
})
const logout = asyncHandler(async (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'logout success' });
})

const isLoggedIn = asyncHandler(async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.json({ loggedIn: false });
    }
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ loggedIn: false });
        }
        req.user = decoded
        return res.json({ loggedIn: true, userInfo: req.user });
    });
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    isLoggedIn
}
