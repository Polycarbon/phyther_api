'use strict'

const express = require('express')
const router = express.Router()
const doctorController = require('../../controllers/doctor.controller')
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')
const auth = require('../../middlewares/authorization')

router.post('/register', validator(create), doctorController.register) // validate and register
router.post('/login', authController.login) // login
router.post('/enroll', auth(['doctor']), doctorController.enrollPatient)
router.get('/patients', auth(['doctor']), doctorController.getMyPatients)
router.get('/patients/:HN', auth(['doctor']), doctorController.getPatient)
router.post('/assign/:HN', auth(['doctor']), doctorController.assign)
router.get('/assignment/:HN', auth(['doctor']), doctorController.getAssignment)
router.post('/deleteAssignment/:HN', auth(['doctor']), doctorController.deleteAssignment)
module.exports = router
