'use strict'

const cron = require('node-cron')
const Event = require('../models/event.model')
const Course = require('../models/course.model')
const Exercise = require('../models/exercise.model')
const Patient = require('../models/patient.model')

cron.schedule('1 * * * * *', async () => {
  console.log('running every minute 1, 2, 4 and 5')
  let events = await Event.find({status: 'Active', isAssign: false}).populate('model').exec()
  events.forEach(async e => {
    const {title, model, presentRound, totalRound, toPatient, gestureSetting} = e
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const exercise = new Exercise({title, model, round: presentRound + 1, startDate: today, endDate: tomorrow, result: gestureSetting})
    if (exercise.status === 'Active' || exercise.status === 'In progress') exercise.classes = 'event-success'
    else if (exercise.status === 'Coming Soon' || exercise.status === 'New') exercise.classes = 'event-warning'
    else if (exercise.status === 'Finished' || exercise.status === 'Ended') exercise.classes = 'event-primary'
    const savedEvent = await exercise.save()
    Patient.findOneAndUpdate({_id: toPatient}, {$push: {exercises: savedEvent._id}}, {new: true})
      .then(() => {
        // patient.events.push(savedEvent)
        e.isAssign = true
        e.presentRound = presentRound + 0
        e.progress = Math.round((presentRound / totalRound) * 100)
        e.save()
      }).catch(err => {
        console.log(err)
      })
  })
  console.log(events)
})

cron.schedule('0 0 0 * * *', async () => {
  Course.update({status: 'Coming Soon', startDate: {$lt: new Date()}},
    {$set: {status: 'Active'}}, {'multi': true},
    (err, writeResult) => {
      if (err) {
        console.log(err)
      }
      console.log(writeResult)
    })
  Course.update({status: 'Active', endDate: {$lt: new Date()}},
    {$set: {status: 'Ended'}}, {'multi': true},
    (err, writeResult) => {
      if (err) {
        console.log(err)
      }
      console.log(writeResult)
    })
  Course.update({status: 'Active'},
    {$set: {isAssign: false}}, {'multi': true},
    (err, writeResult) => {
      if (err) {
        console.log(err)
      }
      console.log(writeResult)
    })
  Exercise.update({$or: [{status: 'New'}, {status: 'In progress'}], endDate: {$lt: new Date()}},
    {$set: {status: 'Finished'}}, {'multi': true},
    (err, writeResult) => {
      if (err) {
        console.log(err)
      }
      console.log(writeResult)
    })
})
