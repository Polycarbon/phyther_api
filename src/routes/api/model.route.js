'use strict'
const express = require('express')
const router = express.Router()
const modelController = require('../../controllers/model.controller')

router.post('', modelController.createCourse) // create model
router.get('', modelController.find) // find model
router.post('/:_id', modelController.edit) // edit model
router.get('/:_id', modelController.findById) // find model
router.delete('/:_id', modelController.deleteById) // find model
module.exports = router
