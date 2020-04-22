'use strict'

const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')
const auth = require('../../middlewares/authorization')

/* ----------  Validate and Register  ---------- */
router.post('/register', validator(create), authController.register)
/* ----------  Login  ---------- */
router.post('/login', authController.login)
/* ----------  Refresh Token  ---------- */
router.post('/refreshToken', authController.refreshToken)

// Authentication example
router.get('/secret1', auth(), (req, res) => {
  // example route for auth
  res.json({ message: 'Anyone can access(only authorized)' })
})
router.get('/secret2', auth(['doctor']), (req, res) => {
  // example route for auth
  res.json({ message: req.user })
})
router.get('/secret3', auth(['user']), (req, res) => {
  // example route for auth
  res.json({ message: 'Only user can access' })
})

module.exports = router
