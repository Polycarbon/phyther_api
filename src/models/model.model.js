'use strict'
const mongoose = require('mongoose')
const gestureSchema = require('./gesture.model').schema
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')

const modelSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  layer: {
    type: String
  },
  weight: {
    type: String
  },
  classNumber: Number,
  gestures: [gestureSchema]
}, {
  timestamps: true
})
// modelSchema.plugin(uniqueValidator)
module.exports = mongoose.model('model', modelSchema)
