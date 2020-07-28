const Patient = require('../models/patient.model')
const Event = require('../models/event.model')
const httpStatus = require('http-status')

// ////////////////////////////////////////////
// events
// ////////////////////////////////////////////
exports.addEvent = async (req, res, next) => {
  // Find user and update it with the request body
  const today = new Date()
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const patient = await Patient.findOne(req.params)
  if (startDate <= today && today <= endDate) req.body.status = 'Active'
  if (today >= endDate) req.body.status = 'Ended'
  req.body.startDate = startDate
  req.body.endDate = endDate
  const event = new Event(req.body)
  event.toPatient = patient._id
  event.totalRound = diffDays
  const savedEvent = await event.save()
  Patient.findOneAndUpdate(req.params, {$push: {courses: savedEvent._id}}, {new: true})
    .then(patient => {
      patient = patient.transform()
      patient.courses.push(savedEvent)
      res.status(httpStatus.OK)
        .send(patient)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.removeEvent = async (req, res, next) => {
  // Find user and update it with the request body
  const {HN, eventId} = req.params
  // query
  Patient.updateOne({HN}, {'$pull': { courses: eventId }}, { safe: true, multi: true })
    .then(async result => {
      await Event.deleteOne({_id: eventId})
      res.status(httpStatus.OK)
        .send(result)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.fetchEvents = async (req, res, next) => {
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
      path: 'courses',
      match: {$or: [{startDate: {$gte: startDate, $lt: endDate}}, {endDate: {$gte: startDate, $lt: endDate}}]}
    })
    .populate({
      path: 'exercises',
      match: {$or: [{startDate: {$gte: startDate, $lt: endDate}}, {endDate: {$gte: startDate, $lt: endDate}}]}
    })
    .exec(async (err, patient) => {
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
