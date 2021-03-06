'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  create: {
    body: {
      username: Joi.string().min(4).max(20).required(),
      password: Joi.string().min(6).max(128).required(),
      first_name: Joi.string().max(128).required(),
      last_name: Joi.string().max(128).required()
    }
  }
}
