const models = require('../models')
const auth = require('./auth')
const Util = require('./util')


const getTags = async (request, response) => {

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (decodedToken1 == null) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const userFind = await models.User.findById(decodedToken1.id)
    const entries = await models.Tag.find({owner:userFind.id})
    response.json({entries})
}
  
const addTags = async (request,response) => {

    const body = request.body

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    const userFind = await models.User.findById(decodedToken1.id)
    if (!body.name) return response.status(400).json({status:"mising name"})
    const entry = new models.Tag({
        name:body.name,
        owner:userFind.id
    })
    const entryNew = await entry.save()


    response.status(201).json(entryNew)

}


const deleteTags = async (request,response) => {

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    const id = request.params.id
    if(!id) return response.status(400).json({status:"missing id"})
   
    const userFind = await models.User.findById(decodedToken1.id)

    const entry = await models.Tag.findById(id, (err) => { 
        if (err) {
             response.status(404).json({"error":"could not locate tag"})
        }
     }).clone();
     if (entry.owner != userFind.id) return response.status(403).json({"error":"forbidden"})

    const it = await models.Tag.deleteOne({_id: id})
    const updateResult = await models.Journal.updateMany(
        { 'tags.id': id },
        { $pull: { 'tags': { id: id } } }
      );
    const tags = await models.Tag.find({owner:userFind.id})
    response.status(200).json({tags,updateResult})
}


const modifyTags = async (request, response) => {
    const body = request.body

    if (request.get('Authorization') == undefined) {
        return response.status(401).json({status:"unauthenticated"})
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    const id = request.params.id
    if(!id) return response.status(400).json({status:"missing id"})
    
    const userFind = await models.User.findById(decodedToken1.id)

    const entry = await models.Tag.findById(id, (err) => { 
        if (err) {
                response.status(404).json({"error":"could not locate tag"})
        }
        }).clone();
        if (entry.owner != userFind.id) return response.status(403).json({"error":"forbidden"})
        
    const newTagData = { name: body.name, entryCount: entry.entryCount, owner: entry.owner, id:entry.id }; // Replace with the new tag data
    const it = await models.Tag.findByIdAndUpdate(id, newTagData )

    const updateResult = await models.Journal.updateMany(
        { 'tags.id': entry.id },
        { $set: { 'tags.$': newTagData } }
    );
    const tags = await models.Tag.find({owner:userFind.id})

    response.status(200).json({it, updateResult,tags})
}
module.exports = {
    getTags,
    addTags,
    deleteTags,
    modifyTags
}