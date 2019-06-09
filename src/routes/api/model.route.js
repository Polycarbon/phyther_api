'use strict'
const express = require('express')
const router = express.Router()
const modelController = require('../../controllers/model.controller')

router.post('', modelController.createModel) // create model
router.get('', modelController.find) // find model
router.post('/:model_name', modelController.editModel) // edit model
router.get('/:model_name', modelController.findByName) // find model
module.exports = router
