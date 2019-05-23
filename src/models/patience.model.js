const mongoose = require('mongoose')
const User = require('./user.model')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const patienceSchema = new Schema({
  HN: {
    unique: true,
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5
  },
  exercise_program: {
    type: Array
  }
})
patienceSchema.plugin(uniqueValidator)
module.exports = User.discriminator('Patience', patienceSchema)
