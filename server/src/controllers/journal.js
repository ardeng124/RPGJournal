const models = require('../models')
const auth = require('./auth')
const verify = require('../jwtAuth')

const getJournalEntries = async (request, response) => {
    const authHeader = request.get('Authorization')
    console.log(authHeader)
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.substring(6)
        let verification = await verify.jwtCheck(token)
        // console.log(verification)
    }
    const entries = await models.Journal.find({})
        .sort('timestamp')
    response.json({entries})
}
  
const getJournalEntry = async (request, response) => {
    const id = request.params.id
    const entry = await models.Journal.findById(id, (err) => { 
       
     response.sendStatus(404)
     });
    response.json(entry)
}

module.exports = {
    getJournalEntries,
    getJournalEntry
}