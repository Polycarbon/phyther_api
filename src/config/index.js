require('dotenv').config() // load .env file

module.exports = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    access_token_duration: process.env.JWT_ACCESS_TOKEN_DURATION,
    refresh_token_duration: process.env.JWT_REFRESH_TOKEN_DURATION
  },
  mongo: {
    uri: process.env.MONGOURI,
    testURI: process.env.MONGOTESTURI
  }
}
