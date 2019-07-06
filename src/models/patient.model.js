const mongoose = require('mongoose')
const User = require('./user.model')
const modelSchema = require('./model.model').schema
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')
const patienceSchema = new Schema({
  HN: {
    unique: true,
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  assignments: [modelSchema]
})
const exerciseDoc = patienceSchema.path('assignments')
exerciseDoc.discriminator('assignment', new Schema({
  assignment_name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Complete', 'Expired', 'Incomplete'],
    default: 'Incomplete'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  date_time: Date
}))

module.exports = User.discriminator('patient', patienceSchema)
