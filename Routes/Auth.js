const express = require('express')
const router = express.Router()
const { registerUser, loginUser, isLoggedIn, logout } = require('../Controller/Auth')
const { checkAuth } = require('../Middleware/checkAuth')

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.get('/auth/logout', checkAuth, logout)
router.get('/auth/is_logged_in', isLoggedIn)

module.exports = router