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
             response.status(404).json({"error":"could not locate entry"})
        }
     }).clone();
     if (entry.owner != userFind.id) return response.status(403).json({"error":"forbidden"})

    const it = await models.Tag.deleteOne({_id: id})
    response.status(200).json({it})
}

module.exports = {
    getTags,
    addTags,
    deleteTags
}