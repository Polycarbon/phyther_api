'use strict'
const express = require('express')
const router = express.Router()
const authRouter = require('./auth.route')
const patientRouter = require('./patient.route')
const doctorRouter = require('./doctor.route')
const modelRouter = require('./model.route')
const courseRouter = require('./course.route')

router.get('/status', (req, res) => { res.send({status: 'OK'}) }) // api status

router.use('/auth', authRouter) // mount auth paths
router.use('/patient', patientRouter) // mount patience paths
router.use('/doctor', doctorRouter) // mount patience paths
router.use('/model', modelRouter)
router.use('/course', courseRouter)

module.exports = router
