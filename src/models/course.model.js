'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Event = require('./event.model')
// const uniqueValidator = require('mongoose-unique-validator')

const courseSchema = new Schema({
  status: {
    type: String,
    enum: ['Ended', 'Active', 'Coming Soon'],
    default: 'Coming Soon'
  },
  isAssign: {
    type: Boolean,
    default: false
  },
  presentRound: {
    type: Number,
    default: 0
  },
  totalRound: {
    type: Number,
    default: 0
  },
  gestureSetting: [
    {
      _id: false,
      id: Number,
      name: String,
      round: Number,
      enable: {
        type: Boolean,
        default: true
      }
    }
  ]
})
// modelSchema.plugin(uniqueValidator)
module.exports = Event.discriminator('course', courseSchema)
