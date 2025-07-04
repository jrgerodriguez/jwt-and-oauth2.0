const express = require('express')
const router = express.Router()
const controller = require('../controllers/')

router.post('/create-username', controller.createUsername)
router.post('/login', controller.processLogin)
router.get('/logout', controller.processLogout)

module.exports = router