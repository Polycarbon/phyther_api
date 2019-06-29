'use strict'

const express = require('express')
const router = express.Router()
const doctorController = require('../../controllers/doctor.controller')
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')

router.post('/register', validator(create), doctorController.register) // validate and register
router.post('/login', authController.login) // login
router.post('/enroll', doctorController.enrollPatient)
router.get('/getPatient/:id', doctorController.getPatient)
module.exports = router
