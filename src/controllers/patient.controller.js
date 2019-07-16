const User = require('../models/user.model')
const Patient = require('../models/patient.model')
const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const config = require('../config')
const axios = require('axios')
const Course = require('../models/course.model')

exports.register = async (req, res, next) => {
  console.log(req.body)
  try {
    const patient = new Patient(req.body)
    const savedPatience = await patient.save()
    res.status(httpStatus.CREATED)
      .send(savedPatience.transform())
  } catch (error) {
    // console.log(error)
    return next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const patient = await Patient.findAndGenerateToken(req.body)
    const payload = {data: patient.transform()}
    const token = jwt.sign(payload, config.secret)
    return res.json({message: 'OK', accessToken: token, patient: patient.transform()})
  } catch (error) {
    next(error)
  }
}

exports.getPatient = (req, res, next) => {
  Patient.find()
    .then(async patients => {
      let transformedPatients = await patients.map(patient => patient.transform())
      res.status(httpStatus.OK)
        .send(transformedPatients)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.getPatientByHN = (req, res, next) => {
  Patient.findOne(req.params)
    .then(async patient => {
      res.status(httpStatus.OK)
        .send({
          message: 'OK',
          patient: patient.transform()
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
exports.getAssignment = (req, res, next) => {
  Patient.findOne(req.params)
    .then(async patient => {
      res.status(httpStatus.OK)
        .send({
          message: 'OK',
          assignments: patient.assignments
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
exports.assign = async (req, res, next) => {
  // Find user and update it with the request body
  try {
    let startDate = new Date(req.body.start_date)
    let endDate = new Date(req.body.end_date)
    let i = 0
    let course = await Course.findOne({course_name: req.body.name})
    // eslint-disable-next-line no-unmodified-loop-condition
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      course.exercises.forEach(async exercise => {
        if (exercise.routine.indexOf(getDayOfWeek(d)) !== -1) {
          i += 1
          let assignment = {}
          // eslint-disable-next-line camelcase
          let {model_name, gestures, layer, weight} = exercise
          assignment.type = 'assignment'
          // eslint-disable-next-line camelcase
          assignment.model_name = model_name
          assignment.assignment_name = course.course_name + ' ' + i
          assignment.layer = layer
          assignment.weight = weight
          assignment.gestures = gestures
          assignment.date_time = d
          await Patient.findOneAndUpdate(req.params, {$push: {assignments: assignment}}, {new: true})
        }
      })
    }
    res.status(httpStatus.OK)
      .send({
        data: 'ok'
      })
  } catch (error) {
    console.log(error)
    return next(error)
  }
  function getDayOfWeek (date) {
    let dayOfWeek = new Date(date).getDay()
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
  }
}

exports.updateAssignment = async (req, res, next) => {
  // Find user and update it with the request body
  // let update = {$set: req.body}
  let gestures = req.body.gestures
  let query = {
    HN: req.params.HN,
    'assignments._id': req.body._id,
    'assignments.type': 'assignment'
  }
  let update = {
    'assignments.$[assignment].status': req.body.status,
    'assignments.$[assignment].progress': req.body.progress
  }
  let itemsProcessed = 0
  gestures.forEach(async (gesture, index, array) => {
    update['assignments.$[assignment].gestures.$[gesture].pass'] = gesture.pass
    update['assignments.$[assignment].gestures.$[gesture].fail'] = gesture.fail
    let opts = {
      arrayFilters: [{
        'assignment._id': {$eq: req.body._id}
      }, {
        'gesture.gesture_id': {$eq: gesture.gesture_id}
      }],
      upsert: true,
      strict: false,
      new: true
    }
    let result = await Patient.update(query, {$set: update}, opts)
    itemsProcessed++
    if (itemsProcessed === array.length) {
      res.send(result)
    }
  })
  console.log(req.body._id)
  //
}

exports.updateAssignments = async (req, res, next) => {
  // Find user and update it with the request body
  let update = {$set: req.body}
  Patient.findOneAndUpdate(req.params._id, update, {new: true})
    .then(original => {
      if (!original) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            success: false,
            message: req.params.HN + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send({
          success: true,
          message: req.params.HN + ' is updated.'
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          success: false,
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.mockAssignments = async (req, res, next) => {
  // Find user and update it with the request body
  let patient = await Patient.findOne({HN: req.params.HN})
  patient.assignments.forEach(async assignment => {
    assignment.gestures.forEach(gesture => {
      gesture.pass = 5
      gesture.fail = Math.floor(Math.random() * 5)
    })
    assignment.status = 'Complete'
    assignment.progress = 100
    console.log(assignment)
    let query = {
      HN: req.params.HN,
      'assignments.type': 'assignment'
    }
    let update = {
      'assignments.$[assignment].status': assignment.status,
      'assignments.$[assignment].progress': assignment.progress,
      'assignments.$[assignment].gestures': assignment.gestures
    }
    let opts = {
      arrayFilters: [{'assignment._id': {$eq: assignment._id}}],
      upsert: true,
      strict: false,
      new: true
    }
    let result = await Patient.update(query, {$set: update}, opts)
  })
  res.send('ok')
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

exports.generate = async (req, res, next) => {
  let data = await axios.get('https://randomuser.me/api/?inc=gender,name,login,email,picture,cell,location&nat=us&results=' + req.params.n)
  let results = data['data']['results']
  let savedPatients = await results.map(async user => {
    let patient = new Patient({
      HN: 'HN' + Math.floor(Math.random() * (899)) + 100,
      username: user.login.username,
      password: user.login.password,
      first_name: user.name.first,
      last_name: user.name.last
    })
    let savedPatient = await patient.save()
    return savedPatient
  })
  console.log(savedPatients)
  res.status(httpStatus.ACCEPTED)
    .send('generate success')
}
