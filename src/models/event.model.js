'use strict'
const mongoose = require('mongoose')
const gestureSchema = require('./gesture.model').schema
const modelSchema = require('./model.model').schema
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  classes: String,
  model: {type: mongoose.Schema.Types.ObjectId, ref: 'model'},
  toPatient: {type: mongoose.Schema.Types.ObjectId, ref: 'patient'},
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  eventType: {
    type: String,
    enum: ['course', 'exercise']
  },
  result: [
    {
      _id: false,
      id: Number,
      name: String,
      pass: {
        type: Number,
        default: 0
      },
      fail: {
        type: Number,
        default: 0
      },
      round: Number,
      finished: {
        type: Boolean,
        default: false
      },
      enable: {
        type: Boolean,
        default: false
      }
    }
  ]
}, {
  timestamps: false,
  discriminatorKey: 'eventType'
})

module.exports = mongoose.model('event', eventSchema)
