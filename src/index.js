'use strict'

const mongoose = require('./services/mongoose')
const app = require('./services/express')
process.env.TZ = 'Asia/Jakarta'
// start app and connect to database
app.start()
mongoose.connect()

module.exports = app
