'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')

const modelSchema = new Schema({
  layer: {
    type: String
  },
  weight: {
    type: String
  },
  class_size: {
    type: Number
  },
  model_name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  gestures: [{
    gesture_id: {
      type: Number,
      required: true
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    picture: {
      type: String
    },
    video: String,
    round: {
      type: Number
    },
    complete: {
      type: Boolean,
      default: false
    },
    pass: {
      type: Number,
      default: 0
    },
    fail: {
      type: Number,
      default: 0
    },
    enable: Boolean
  }],
  type: {
    type: String,
    default: 'model'
  }
}, {
  timestamps: true,
  discriminatorKey: 'type'
})
// modelSchema.plugin(uniqueValidator)
module.exports = mongoose.model('model', modelSchema)
