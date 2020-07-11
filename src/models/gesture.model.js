'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')

const gestureSchema = new Schema({
  _id: false,
  id: Number,
  name: String,
  img: String,
  video: String,
  round: Number,
  enable: Boolean
}, {
  timestamps: false
})

module.exports = mongoose.model('gesture', gestureSchema)
