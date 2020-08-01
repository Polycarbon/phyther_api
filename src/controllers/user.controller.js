const User = require('../models/user.model')
const Patient = require('../models/patient.model')
const Doctor = require('../models/doctor.model')
const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const config = require('../config')
const axios = require('axios')
const Event = require('../models/event.model')

// ////////////////////////////////////////////
// User
// ////////////////////////////////////////////

exports.getUser = async (req, res, next) => {
  const patients = await Patient.find()
    .populate({
      path: 'courses',
      match: {$or: [{status: 'Active'}, {status: 'Coming Soon'}]}
    })
  let transformedPatients = await patients.map(patient => {
    let p = patient.transform()
    if (p.courses.length) {
      p.status = 'Active'
    } else {
      p.status = 'Inactive'
    }
    return p
  })
  const doctors = await Doctor.find()
  let transformedDoctors = await doctors.map(doctor => doctor.transform())
  let users = transformedDoctors.concat(transformedPatients)
  res.status(httpStatus.OK)
    .send(users)
}

exports.deleteById = async (req, res, next) => {
  // Find user and update it with the request body
  let conditions = {_id: req.params.userId}

  User.deleteOne(conditions)
    .then(result => {
      console.log(result)
      if (!result) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            message: req.params.userId + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send({
          message: req.params.userId + ' is updated.',
          course: result
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
