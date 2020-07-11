'use strict'

const express = require('express')
const router = express.Router()
const patientController = require('../../controllers/patient.controller')
const eventController = require('../../controllers/event.controller')
const courseController = require('../../controllers/course.controller')
const exerciseController = require('../../controllers/exercise.controller')
// const authController = require('../../controllers/auth.controller')
const auth = require('../../middlewares/authorization')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')

router.post('/register', validator(create), patientController.register) // validate and register
router.post('/login', patientController.login) // login
router.get('', patientController.getPatient)
router.get('/:HN', patientController.getPatientByHN)

router.get('/:HN/events', eventController.fetchEvents)

router.post('/:HN/courses', courseController.addCourse)
router.get('/:HN/courses', courseController.fetchCourses)
router.delete('/:HN/courses/:eventId', courseController.removeCourse)

router.get('/:HN/exercises', exerciseController.fetchExercises)
router.delete('/:HN/exercises/:eventId', exerciseController.removeExercise)

router.get('/assignment/:HN', patientController.getAssignment)
router.post('/assign/:HN', patientController.assign)
router.post('/updateAssignment/:HN', patientController.updateAssignment)
router.post('/mockAssignment/:HN', patientController.mockAssignments)
router.post('/deleteAssignment/:HN', patientController.deleteAssignment)

// utilization
router.get('/generate/:n', patientController.generate) // genarate
module.exports = router
