const express = require('express')
const auth = require('./controllers/auth')
const journal = require('./controllers/journal')
const { requiresAuth } = require('express-openid-connect');

const router = express.Router()
 
// router.get('/', function(req, res) {
//   res.sendFile('index.html', {root: path.join(__dirname, '../../build/')});
// });

router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});
router.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});
router.get('/api/journal/:id', journal.getJournalEntry)
router.get('/api/journal/',requiresAuth(),  (req, res) => {
  journal.getJournalEntries(req,res)
})

router.get('/api/journal/',requiresAuth(),)


module.exports = router 