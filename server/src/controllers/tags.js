const models = require('../models')
const auth = require('./auth')
const Util = require('./util')


const getTags = async (request, response) => {
  try {
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
  }catch (e) {
    console.error(e);
    response.status(500).json({ error: "server error" });
  }
}
  
const addTags = async (request,response) => {
  try {
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
  }catch (e) {
    console.error(e);
    response.status(500).json({ error: "server error" });
  }

}


const deleteTags = async (request,response) => {
  try {
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
  }catch (e) {
    console.error(e);
    response.status(500).json({ error: "server error" });
  }
}

const modifyTags = async (request, response) => {
    try {
      const body = request.body;
      const id = request.params.id;
  
      if (!request.get('Authorization')) {
        return response.status(401).json({ status: "unauthenticated" });
      }
  
      const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
      if (!decodedToken1) {
        return response.status(401).json({ status: "unauthenticated" });
      }
  
      if (!id) {
        return response.status(400).json({ status: "missing id" });
      }
      
      const userFind = await models.User.findById(decodedToken1.id).lean();
      userFind.id = userFind._id.toString();

      const tag = await models.Tag.findOne({ _id: id, owner: userFind.id });
      if (!tag) {
        return response.status(404).json({ error: "could not locate tag" });
      }
  
      const newTagData = {
        name: body.name,
        owner: tag.owner,
        id: tag.id,
        _id:tag._id
      };
  
      // Update the tag
      tag.name = newTagData.name;
      const updatedTag = await tag.save()
    //   const updatedTag = await models.Tag.findByIdAndUpdate(id, newTagData).lean();
    //   const updatedTag = await models.Tag.updateOne({id:id}, newTagData).lean();    
      // const bulkOperations = [
      //   {
      //     updateMany: {
      //       filter: { 'tags.id': id },
      //       update: { $set: { 'tags.$': newTagData } },
      //     },
      //   },
      // ];
    const bulkOperations = [
        {
            updateMany: {
                filter: {
                    'tags': {
                        $elemMatch: {
                            $or: [
                                { id: id }, // Match by tags.id
                                { _id: id }, // Match by tags._id
                            ],
                        },
                    },
                },
                update: { $set: { "tags.$": newTagData } },
            },
        },
    ]
      // Execute bulk write
      const bulkResult = await models.Journal.bulkWrite(bulkOperations);
      response.status(200).json({ updatedTag, bulkResult });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "server error" });
    }
  };
  
module.exports = {
    getTags,
    addTags,
    deleteTags,
    modifyTags
}