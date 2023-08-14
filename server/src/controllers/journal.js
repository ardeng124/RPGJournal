const models = require('../models')
const auth = require('./auth')
const Util = require('./util')

const getJournalEntries = async (request, response) => {

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const userFind = await models.User.findById(decodedToken1.id)
    const entries = await models.Journal.find({owner:userFind.id})
        .sort('timestamp')
    response.json({entries})
}
  
const getJournalEntry = async (request, response) => {

    if (request.get('Authorization') == undefined) {
       return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }

    const id = request.params.id
    const entry = await models.Journal.findById(id, (err) => { 
        if (err) {
             response.status(404).json({"error":"could not locate entry"})
        }
     }).clone();
     response.status(200).json(entry)
}

const addJournalEntry = async (request, response) => {
    const body = request.body

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));

    const username = await Util.getDecodedToken(Util.getToken(request)).username
    const userFind = await models.User.findById(decodedToken1.id)
    if (!body.title) return response.status(400).json({status:"mising title"})
    if (!body.content) return response.status(400).json({status:"mising content"})
    const entry = new models.Journal({
        title: body.title,
        content: body.content,
        tags: body.tags, 
        date: new Date(),
        owner: userFind.id
    })
    const savedItem = await entry.save()

    const decodedToken = Util.getDecodedToken(Util.getToken(request));

    const userPush = await models.User.findByIdAndUpdate(
        decodedToken.id,
        {"$push" : {"entries": entry.id}}
    )

    response.json(savedItem)
}

const modifyJournalEntry = async (request, response) => {
    const body = request.body

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }

    const id = request.params.id
    if(!id) return response.status(400).json({status:"missing id"})
   
    
    const entry = await models.Journal.findById(id, (err) => { 
        if (err) {
             response.status(404).json({"error":"could not locate entry"})
        }
     }).clone();
     
    const entryNew = {
        "title": body.title ? body.title : entry.title,
        "content" : body.content ? body.content :entry.content,
        "tags": entry.tags, 
        "date":entry.date, 
        "id": body.id,
        "owner": body.owner
    }
    const it = await models.Journal.findByIdAndUpdate(id, entryNew )
    console.log(it)
    response.status(200).json({entryNew})
}
module.exports = {
    getJournalEntries,
    getJournalEntry,
    addJournalEntry,
    modifyJournalEntry
}