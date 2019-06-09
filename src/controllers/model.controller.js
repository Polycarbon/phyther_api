const Model = require('../models/model.model')
const httpStatus = require('http-status')

exports.createModel = async (req, res, next) => {
  try {
    const model = new Model(req.body)
    const savedModel = await model.save()
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

exports.findByName = async (req, res, next) => {
  Model.findOne(req.params)
    .then(async model => {
      if (!model) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            success: false,
            message: req.params.model_name + ' not exist.'
          })
        return
      }
      res.status(httpStatus.OK)
        .send({
          success: true,
          model: model
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          success:false,
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

exports.editModel = async (req, res, next) => {
  // Find user and update it with the request body
  let conditions = {model_name: req.params.model_name}
  let update = {$set: req.body}

  Model.findOneAndUpdate(conditions, update)
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
          message: req.params.model_name + ' is updated.'
        })
    }).catch(err => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({
          message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}
