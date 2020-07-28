const Patient = require('../models/patient.model')
const Exercise = require('../models/event.model')
const httpStatus = require('http-status')

// ////////////////////////////////////////////
// events
// ////////////////////////////////////////////

exports.removeExercise = async (req, res, next) => {
  // Find user and update it with the request body
  const {HN, eventId} = req.params
  // query
  Patient.updateOne({HN}, {'$pull': { exercises: eventId }}, { safe: true, multi: true })
    .then(async result => {
      await Exercise.deleteOne({_id: eventId})
      res.status(httpStatus.OK)
        .send(result)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
exports.updateExercise = async (req, res, next) => {
  // Find user and update it with the request body
  const {eventId} = req.params
  let result = req.body.result
  // query
  Exercise.findByIdAndUpdate(eventId, {'result': result}, { safe: true, multi: true })
    .then(async result => {
      res.status(httpStatus.OK)
        .send(result)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.fetchExercises = async (req, res, next) => {
  // Find user and update it with the request body
  const today = new Date()
  let startDate = new Date(today.getFullYear(), today.getMonth(), 0)
  let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  // if startDate or endDate is defined
  if (req.body.startDate) startDate = new Date(req.body.startDate)
  if (req.body.endDate) endDate = new Date(req.body.endDate)
  // query
  Patient.findOne(req.params)
    .populate({
      path: 'exercises',
      match: {$or: [{startDate: {$gte: startDate, $lt: endDate}}, {endDate: {$gte: startDate, $lt: endDate}}]}
    })
    .exec(async (err, patient) => {
      console.log(patient)
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            message: err.message || 'Some error occurred while retrieving notes.'
          })
      }
      res.status(httpStatus.OK)
        .send(patient.transform())
    })
}
