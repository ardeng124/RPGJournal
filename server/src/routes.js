const express = require('express')
const auth = require('./controllers/auth')
const conv = require('./controllers/conversations')
const messages = require('./controllers/messages')

const router = express.Router()
 
router.get('/', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../build/')});
});


module.exports = router 