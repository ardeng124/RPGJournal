const { auth } = require('express-oauth2-jwt-bearer');


const jwtCheck = auth({
    secret: process.env.SECRET,
    audience: 'unique identifier',
    issuerBaseURL: 'https://dev-ahyf2hi5h6vaqo21.au.auth0.com/',
    tokenSigningAlg: 'HS256'
  })

  module.exports = { jwtCheck }