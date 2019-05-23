const User = require('../models/user.model')
const Patience = require('../models/patience.model')
const httpStatus = require('http-status')

exports.register = async (req, res, next) => {
  try {
    const patience = new Patience(req.body)
    const savedPatience = await patience.save()
    res.status(httpStatus.CREATED)
      .send(savedPatience.transform())
  } catch (error) {
    console.log(error)
    return next(User.checkDuplicateEmailError(error))
  }
}
