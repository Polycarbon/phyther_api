const mongoose = require('mongoose')
const User = require('./user.model')
const Schema = mongoose.Schema

const doctorSchema = new Schema({
  patients: [{type: Schema.Types.ObjectId, ref: 'patient'}]
})
module.exports = User.discriminator('doctor', doctorSchema)
