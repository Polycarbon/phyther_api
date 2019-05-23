'use strict'

const express = require('express')
const router = express.Router()
const patienceController = require('../../controllers/patience.controller')
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')

router.post('/register', validator(create), patienceController.register) // validate and register
router.post('/login', authController.login) // login

module.exports = router
