'use strict'

const express = require('express')
const router = express.Router()
const patientController = require('../../controllers/patient.controller')
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')

router.post('/register', validator(create), patientController.register) // validate and register
router.post('/login', patientController.login) // login
router.get('', patientController.getPatient)
router.get('/:HN', patientController.getPatientByHN)
router.get('/generate/:n', patientController.generate) // genarate
router.get('/assignment/:HN', patientController.getAssignment)
router.post('/assign/:HN', patientController.assign)
router.post('/updateAssignment/:HN', patientController.updateAssignment)
router.post('/mockAssignment/:HN', patientController.mockAssignments)
router.post('/deleteAssignment/:HN', patientController.deleteAssignment)
module.exports = router
