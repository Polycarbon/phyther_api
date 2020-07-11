const User = require('../models/user.model')
const Doctor = require('../models/doctor.model')
const Course = require('../models/event.model')
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
  let doctor = req.user
  try {
    // find the delete uid in the favorites array
    if (!req.body._id) {
      let pt = req.body
      pt.enrolled_by = {user_id: doctor._id, username: doctor.username}
      let patient = new Patient(pt)
      let savedPatient = await patient.save()
      doctor.patients.push(savedPatient)
    } else {
      if (!doctor.patients.includes(req.body._id)) {
        let patient = await Patient.findOne({_id: req.body._id})
        doctor.patients.push(patient)
      }
    }
    let savedDoctor = await doctor.save()
    res.send(savedDoctor.transform())
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.assign = async (req, res, next) => {
  // Find user and update it with the request body
  let patient = await Patient.findOne(req.params)
  if (patient) {
    try {
      let startDate = new Date(req.body.start_date)
      let endDate = new Date(req.body.end_date)
      let course = await Course.findOne({course_name: req.body.name})
      // eslint-disable-next-line no-unmodified-loop-condition
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        course.exercises.forEach(async exercise => {
          if (exercise.routine.indexOf(getDayOfWeek(d)) !== -1) {
            let assignment = {}
            // eslint-disable-next-line camelcase
            let {model_name, gestures, layer, weight} = exercise
            assignment.type = 'assignment'
            // eslint-disable-next-line camelcase
            assignment.model_name = model_name
            assignment.assignment_name = course.course_name
            assignment.layer = layer
            assignment.weight = weight
            assignment.gestures = gestures
            assignment.exercise_date = new Date(d.valueOf())
            patient.assignments.push(assignment)
            // await Patient.findOneAndUpdate(req.params, {$push: {assignments: assignment}}, {new: true})
          }
        })
      }
      let savedPatient = await patient.save()
      res.send(savedPatient.transform())
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
  function getDayOfWeek (date) {
    let dayOfWeek = new Date(date).getDay()
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
  }
}

exports.getAssignment = (req, res, next) => {
  Patient.findOne(req.params)
    .then(async patient => {
      patient.updateAssignmentStatus()
      let updatedPatient = await patient.save()
      res.status(httpStatus.OK)
        .send({
          message: 'OK',
          assignments: updatedPatient.assignments
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.deleteAssignment = async (req, res, next) => {
  console.log(req.body)
  Patient.findOne({HN: req.body.HN}, async function (error, patient) {
    if (error) {
      console.log(error)
      res.send(null, 500)
    } else if (patient) {
      // // find the delete uid in the favorites array
      patient.assignments = await patient.assignments.filter(function (assignment) {
        console.log(assignment._id)
        // eslint-disable-next-line eqeqeq
        return assignment._id != req.body.assignment_id
      })
      try {
        let savedPatience = await patient.save()
        res.status(httpStatus.CREATED)
          .send(savedPatience.transform())
      } catch (error) {
        console.log(error)
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

exports.getMyPatients = async (req, res, next) => {
  try {
    let doctor = await Doctor.findOne({_id: req.user._id}).populate('patients')
    let patients = doctor.patients.map(p => p.transform())
    res.send(patients)
  } catch (error) {
    console.log(error)
    return next(User.checkDuplicateEmailError(error))
  }
}
