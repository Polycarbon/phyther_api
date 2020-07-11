'use strict'

const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const APIError = require('../utils/APIError')

exports.register = async (req, res, next) => {
  try {
    if (req.body.picUrl == null) {
      req.body.picUrl = 'https://api.adorable.io/avatars/80/' + req.body.username + '.png'
    }
    const user = new User(req.body)
    const payload = {data: user.transform()}
    let token = jwt.sign(payload, config.secret, {expiresIn: config.jwt.access_token_duration})
    // If user does not have a refresh token assigned
    if (user.refreshToken === 'false') {
      // user.refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refresh_token_duration})
      user.refreshToken = token
    }
    user.save().then(user => {
      return res.status(httpStatus.CREATED)
        .send({message: 'OK', userData: user.transform(), accessToken: token, refreshToken: user.refreshToken, exp: 60 * 60})
    })
  } catch (error) {
    return next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const payload = {data: user.transform()}
    let token = jwt.sign(payload, config.secret, {expiresIn: config.jwt.access_token_duration})
    let refreshToken
    // If user does not have a refresh token assigned
    if (user.refreshToken === 'false') {
      // user.refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refresh_token_duration})
      user.refreshToken = token
    } else {
      // User has a refresh token so try and verify it and renew if expired
      jwt.verify(user.refreshToken, config.jwt.secret, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
          refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refresh_token_duration})
          user.refreshToken = refreshToken
        }
      })
    }
    user.save().then(() => {
      let exp = new Date()
      exp.setHours(exp.getHours() + 1)
      return res.json({message: 'OK', userData: user.transform(), accessToken: token, refreshToken: user.refreshToken, exp: exp})
    })
  } catch (error) {
    next(error)
  }
}

exports.refreshToken = (req, res, next) => {
  let refreshToken = req.body.accessToken
  // No refresh token supplied
  // console.log(req.headers.authorization)
  if (!refreshToken) {
    return res.send(401)
  }

  jwt.verify(refreshToken, config.jwt.secret, () => {
    // Find a user with the supplied refresh token
    User.findOne({refreshToken: refreshToken}, (err, user) => {
      // Error finding user or no user exists with the supplied refresh token
      if (err || !user) {
        const apiError = new APIError(
          err ? err.message : 'Unauthorized',
          httpStatus.UNAUTHORIZED
        )
        return next(apiError)
      }
      let payload = {data: user.transform()}
      // Create new access token
      let token = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.access_token_duration})
      let exp = new Date()
      exp.setHours(exp.getHours() + 1)
      return res.json({message: 'OK', userData: user.transform(), accessToken: token, refreshToken: user.refreshToken, exp: exp}) // Send back both tokens
    })
  })
}
