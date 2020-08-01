'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')

router.get('', userController.getUser)
router.delete('/:userId', userController.deleteById)
module.exports = router
