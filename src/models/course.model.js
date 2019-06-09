'use strict'
const mongoose = require('mongoose')
const modelSchema = require('./model.model').schema
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')

const courseSchema = new Schema({
  course_name: {
    type: String,
    required: true
  },
  days: {
    type: Number
  },
  exercises: [modelSchema]
}, {
  timestamps: true
})
const exercisesDoc = courseSchema.path('exercises')
exercisesDoc.discriminator('exercise', new Schema({
  gestures: [{
    gesture_id: {
      type: Number
    },
    name: {
      type: String
    },
    picture: {
      type: String
    },
    video: String,
    round: {
      type: Number
    },
    enable: Boolean
  }],
  routine: [{
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }]
}))
module.exports = mongoose.model('course', courseSchema)
