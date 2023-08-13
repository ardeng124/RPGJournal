const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const cookieParser = require('cookie-parser')
const notifier = require('node-notifier')
const cors = require('cors')
// const jwt = require('express-jwt')
// const jwks = require('jwks-rsa')
// const axios = require('axios')
const router = require('./routes')
const config = require('./config')
const { auth } = require('express-openid-connect');
// const verifyJwt = jwt({
//   secret: jwks.expressJwtSecret({
//     cache:true,
//     rateLimit:true,
//     jwksRequestsPerMinute:5,
//     jwksUri:""
//   }),
//   audience:"unique identifier",
//   issuer:"https://dev-ahyf2hi5h6vaqo21.au.auth0.com/",
//   algorithm:['RS256']
// })


const configAuth = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:8102',
  clientID: '4itJLproEx75Uv48FH7WLCwzNaeQbCUa',
  issuerBaseURL: 'https://dev-ahyf2hi5h6vaqo21.au.auth0.com',
  secret: process.env.SECRET
};



function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url
  
  notifier.notify({
    title: title,
    message: str
  })
}

const app = express()
app.use(auth(configAuth));
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
// app.use(jwtAuth.jwtCheck);

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler({ log: errorNotification }))
  }
app.use(cookieParser(config.sessionSecret))

app.use('/', router)



module.exports = app