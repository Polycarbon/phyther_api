const Course = require('../models/course.model')
const httpStatus = require('http-status')

exports.createCourse = async (req, res, next) => {
  try {
    console.log(req.body.exercises[0].routine)
    const course = new Course(req.body)
    const savedCourse = await course.save()
    res.status(httpStatus.CREATED)
      .send(savedCourse)
  } catch (error) {
    console.log(error)
    res.status(httpStatus.BAD_REQUEST)
      .send(error)
  }
}

exports.find = async (req, res, next) => {
  Course.find()
    .then(async models => {
      res.status(httpStatus.OK)
        .send(models)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.findByName = async (req, res, next) => {
  Course.findOne(req.params)
    .then(async model => {
      if (!model) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            message: req.params.model_name + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send(model)
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.editCourse = async (req, res, next) => {
  // Find user and update it with the request body
  let conditions = {model_name: req.params.model_name}
  let update = {$set: req.body}

  Course.findOneAndUpdate(conditions, update)
    .then(original => {
      if (!original) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            message: req.params.model_name + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send({
          message: req.params.model_name + ' is updated.',
          data: original
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
