'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const httpStatus = require('http-status')
const APIError = require('../utils/APIError')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const roles = [
  'user', 'admin', 'doctor', 'patient'
]

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 128
  },
  firstName: {
    type: String,
    maxlength: 50
  },
  lastName: {
    type: String,
    maxlength: 50
  },
  picURL: {
    type: String
  },
  role: {
    type: String,
    default: 'patient',
    enum: roles
  },
  refreshToken: {
    type: String,
    default: false
  }
}, {
  timestamps: true,
  discriminatorKey: 'role'
})
userSchema.pre('save', async function save (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = bcrypt.hashSync(this.password)

    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.method({
  transform () {
    const transformed = this.toObject()
    const exceptfields = ['password', 'updatedAt', 'createdAt', 'refreshToken', 'patients', '__v']

    exceptfields.forEach((field) => {
      delete transformed[field]
    })

    return transformed
  },

  passwordMatches (password) {
    return bcrypt.compareSync(password, this.password)
  }
})

userSchema.statics = {
  roles,

  checkDuplicateEmailError (err) {
    // console.log(Object.keys(err.errors))
    if (err.code === 11000) {
      var error = new Error('username already exist')
      error.errors = [{
        field: 'username',
        location: 'body',
        messages: ['username already exist']
      }]
      error.status = httpStatus.CONFLICT
      return error
    }

    return err
  },

  async findAndGenerateToken (payload) {
    const { username, password } = payload
    if (!username) throw new APIError('Username must be provided for login')

    const user = await this.findOne({ username }).exec()
    if (!user) throw new APIError(`No user associated with ${username}`, httpStatus.UNAUTHORIZED)

    const passwordOK = await user.passwordMatches(password)

    if (!passwordOK) throw new APIError(`Password mismatch`, httpStatus.UNAUTHORIZED)

    return user
  }
}
// userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)
