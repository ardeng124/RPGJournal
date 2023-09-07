const express = require('express')
const auth = require('./controllers/auth')
const journal = require('./controllers/journal')
const tags = require('./controllers/tags')


const router = express.Router()
router.get('/api/journal/:id', journal.getJournalEntry)

router.get('/api/journal/', journal.getJournalEntries)
router.get('/api/followup/', journal.getJournalEntriesFollowup)

router.post('/auth/login', auth.loginUser)
router.post('/auth/register', auth.createUser)
router.post('/api/journal', journal.addJournalEntry)
router.put('/api/journal/:id', journal.modifyJournalEntry)
router.delete('/api/journal/:id', journal.deleteJournalEntry)

router.get('/api/auth/', auth.validate)

router.get('/api/tags/', tags.getTags)
router.post('/api/tags/', tags.addTags)
router.delete('/api/tags/:id', tags.deleteTags)
router.put('/api/tags/:id', tags.modifyTags)

router.get('/api/tags/:id', journal.getJournalEntriesForTag)
router.post('/api/auth/delete/user', auth.deleteUserAndEntries)

router.get("/*", function (req, res) {
   res.sendFile("index.html", { root: path.join(__dirname, "../../build/") })
})
router.get('/', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../build/')});
});
router.get('/dashboard', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../build/')});
});
router.get('/journal/:id', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../build/')});
});
module.exports = router 