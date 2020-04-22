const mongoose = require('mongoose')
const User = require('./user.model')
const userSchema = require('./user.model').schema
const modelSchema = require('./model.model').schema
const Schema = mongoose.Schema
// const uniqueValidator = require('mongoose-unique-validator')
const patientSchema = new Schema({
  HN: {
    unique: true,
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  enrolled_by: {
    user_id: String,
    username: String
  },
  assignments: [modelSchema]
})
patientSchema.method({
  updateAssignmentStatus () {
    this.assignments.forEach((asm) => {
      let exerciseDate = new Date(asm.exercise_date)
      let now = new Date()
      if (asm.status !== 'Expired' && exerciseDate.getDate() < now.getDate() && exerciseDate.getMonth() <= now.getMonth() && exerciseDate.getFullYear() <= now.getFullYear() ) {
        asm.status = 'Expired'
      }
    })
  }
})

const exerciseDoc = patientSchema.path('assignments')
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
  exercise_date: {
    type: Date,
    required: true
  }
}))

module.exports = User.discriminator('patient', patientSchema)
