const User = require('../models/user.model')
const Doctor = require('../models/doctor.model')
const httpStatus = require('http-status')

exports.register = async (req, res, next) => {
  try {
    const doctor = new Doctor(req.body)
    const savedPatience = await doctor.save()
    res.status(httpStatus.CREATED)
      .send(savedPatience.transform())
  } catch (error) {
    console.log(error)
    return next(User.checkDuplicateEmailError(error))
  }
}
exports.enrollPatient = async (req, res, next) => {
  console.log(req.body)
  Doctor.findOne({_id: req.body.doctor._id}, async function (error, doctor) {
    if (error) {
      res.send(null, 500)
    } else if (doctor) {
      // // find the delete uid in the favorites array
      doctor.assignments = doctor.patients.push(req.body.patient._id)
      try {
        let savedDoctor = await doctor.save()
        res.status(httpStatus.CREATED)
          .send(savedDoctor.transform())
      } catch (error) {
        // console.log(error)
        return next(error)
      }
    }
  })
}

exports.getPatient = async (req, res, next) => {
  Doctor
    .findOne({_id: req.params.id}, async function (error, doctor) {
      if (error) {
        res.send(null, 500)
      } else if (doctor) {
      // find the delete uid in the favorites array
        res.status(httpStatus.CREATED)
          .send(doctor.transform())
      }
    })
}
