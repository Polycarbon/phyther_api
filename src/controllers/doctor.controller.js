const User = require('../models/user.model')
const Doctor = require('../models/doctor.model')
const Patient = require('../models/patient.model')
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
  let patient = await Patient.findOne({_id: req.body.patient._id})
  Doctor.findOne({_id: req.body.doctor._id}, async function (error, doctor) {
    if (error) {
      res.send(null, 500)
    } else if (doctor) {
      // find the delete uid in the favorites array
      if (!doctor.patients.includes(patient._id)) {
        doctor.patients.push(patient)
      }
      try {
        let savedDoctor = await doctor.save()
        res.send(savedDoctor.transform())
      } catch (error) {
        // console.log(error)
        return next(error)
      }
    }
  })
}

exports.getPatient = async (req, res, next) => {
  try {
    let doctor = await Doctor.findOne({_id: req.params.id}).populate('patients')
    let patients = doctor.patients.map(p => p.transform())
    res.send(patients)
  } catch (error) {
    console.log(error)
    return next(User.checkDuplicateEmailError(error))
  }
}
