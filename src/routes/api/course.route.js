'use strict'
const express = require('express')
const router = express.Router()
const courseController = require('../../controllers/course.controller')

router.post('', courseController.createCourse) // create model
router.get('', courseController.find) // find model
router.post('/:_id', courseController.editCourse) // edit model
router.get('/:_id', courseController.findByName) // find model
module.exports = router
