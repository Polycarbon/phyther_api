const Model = require('../models/model.model')
const httpStatus = require('http-status')

exports.createCourse = async (req, res, next) => {
  try {
    console.log(req.body)
    const course = new Model(req.body)
    const savedModel = await course.save()
    res.status(httpStatus.CREATED)
      .send(savedModel)
  } catch (error) {
    console.log(error)
    res.status(httpStatus.BAD_REQUEST)
      .send(error)
  }
}

exports.find = async (req, res, next) => {
  Model.find()
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

exports.findById = async (req, res, next) => {
  Model.findOne(req.params)
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

exports.edit = async (req, res, next) => {
  // Find user and update it with the request body
  let conditions = {_id: req.params._id}
  let update = {$set: req.body}

  Model.findOneAndUpdate(conditions, update, {new: true})
    .then(updated => {
      if (!updated) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            message: req.params.model_name + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send({
          message: req.params.model_name + ' is updated.',
          course: updated
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.deleteById = async (req, res, next) => {
  // Find user and update it with the request body
  let conditions = {_id: req.params._id}

  Model.deleteOne(conditions)
    .then(result => {
      console.log(result)
      if (!result) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            message: req.params.model_name + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send({
          message: req.params.model_name + ' is updated.',
          course: result
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
