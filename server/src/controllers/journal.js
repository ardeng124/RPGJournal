const models = require('../models')
const auth = require('./auth')

const getJournalEntries = async (request, response) => {

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