const User = require('../models/user.model')
const Doctor = require('../models/doctor.model')
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
