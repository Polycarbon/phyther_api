'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const exerciseSchema = new Schema({
  model_layer: {
    required: true,
    unique: true
  },
  model_weight: {
    required: true
  },
  name: String,
  gestures: [{
    name: {
      type: String
    },
    picture: {
      type: String
    },
    video: String
  }]
}, {
  timestamps: true
})
module.exports = mongoose.model('User', exerciseSchema)
