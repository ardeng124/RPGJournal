const express = require('express')
const auth = require('./controllers/auth')
const journal = require('./controllers/journal')


const router = express.Router()
 
// router.get('/', function(req, res) {
//   res.sendFile('index.html', {root: path.join(__dirname, '../../build/')});
// });

router.get('/api/journal/:id', journal.getJournalEntry)

router.get('/api/journal/', journal.getJournalEntries)
router.post('/auth/login', auth.loginUser)
router.post('/auth/register', auth.createUser)
router.post('/api/journal', journal.addJournalEntry)
router.put('/api/journal/:id', journal.modifyJournalEntry)

router.get('/api/auth/', auth.validate)


module.exports = router 