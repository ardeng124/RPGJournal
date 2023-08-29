const models = require('../models')
const auth = require('./auth')
const { getTags } = require('./tags')
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
        .sort({'date':"desc"})
    response.json({entries})
}
  
const getJournalEntriesForTag = async (request, response) => {
    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const id = request.params.id

    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const userFind = await models.User.findById(decodedToken1.id)
    const entry = await models.Tag.findById(id, (err) => { 
        if (err) {
                response.status(404).json({"error":"could not locate tag"})
        }
        }).clone();
    if (entry.owner != userFind.id) return response.status(403).json({"error":"forbidden"})

    const entries1 = await models.Journal.find({owner:userFind.id})
        .sort({'date':"desc"})
    let entries = []
        entries1.filter((x) => {
            x.tags.filter(y => {
                if(y.id == id) entries.push(x)
            })
        })
    response.json({entries,entry})
}
const getJournalEntriesFollowup = async (request, response) => {

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const userFind = await models.User.findById(decodedToken1.id)
    const entries = await models.Journal.find({owner:userFind.id})
        .sort({'date':"desc"})
    let entries2 = entries.filter(x => x.followup.followup)
    response.json({entries2})
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
     const userFind = await models.User.findById(decodedToken1.id)
     if (entry.owner != userFind.id) return response.status(403).json({"error":"forbidden"})
     const tags = await models.Tag.find({owner:userFind.id})
     const finalResp = {entry, tags}
     response.status(200).json(finalResp)
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
    const tagArr = []
    for (const tag of body.tags) {
        try {
          const currTag = await models.Tag.findById(tag.id);
          if (userFind.id != currTag.owner.id) {
            return response.status(403).json({ error: "forbidden" });
          }
          tagArr.push(currTag);
        } catch (e) {
          return response.status(404).json({ error: "could not add tag" });
        }
      }
    let blankFollowup = {'followup':false,'date':'null', 'level':'null'}
    const entry = new models.Journal({
        title: body.title,
        content: body.content,
        tags: tagArr, 
        date: new Date(),
        owner: userFind.id,
        followup: body.followup ? body.followup : blankFollowup
    })
    const entryNew = await entry.save()

    // const decodedToken = Util.getDecodedToken(Util.getToken(request));

    // const userPush = await models.User.findByIdAndUpdate(
    //     decodedToken.id,
    //     {"$push" : {"entries": entry.id}}
    // )

    response.status(201).json(entryNew)
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
             response.status(404).json({error:"could not locate entry"})
        }
     }).clone();
     const userFind = await models.User.findById(decodedToken1.id)

    if (entry.owner != userFind.id) return response.status(403).json({error:"forbidden"})
    if (entry.tags) {
        let tags = []
        entry.tags.forEach(async(tag) => {
            try {
                const currTag = models.Tag.findById(tag.id)
                if (entry.owner != currTag.owner) return // response.status(403).json({error:"forbidden"})
                tags.push(currTag)
            } catch (e) {
                console.log(e)
                return response.status(404).json({error:"could not add tag"})
            }
        })
    }
    const entryNew = {
        "title": body.title ? body.title : entry.title,
        "content" : body.content ? body.content :entry.content,
        "tags": body.tags? body.tags : tags, 
        "date":entry.date, 
        "id": body.id,
        "owner": body.owner,
        "followup":body.followup ? body.followup : entry.followup
    }
    const it = await models.Journal.findByIdAndUpdate(id, entryNew )
    response.status(201).json({entryNew})
}

const deleteJournalEntry = async (request, response) => {
    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }

    const id = request.params.id
    if(!id) return response.status(400).json({status:"missing id"})
   
    const userFind = await models.User.findById(decodedToken1.id)

    const entry = await models.Journal.findById(id, (err) => { 
        if (err) {
             response.status(404).json({"error":"could not locate entry"})
        }
     }).clone();
     if (entry.owner != userFind.id) return response.status(403).json({"error":"forbidden"})

    const it = await models.Journal.deleteOne({_id: id})
    response.status(200).json({it})
}

module.exports = {
    getJournalEntries,
    getJournalEntry,
    addJournalEntry,
    modifyJournalEntry,
    deleteJournalEntry,
    getJournalEntriesFollowup,
    getJournalEntriesForTag

}