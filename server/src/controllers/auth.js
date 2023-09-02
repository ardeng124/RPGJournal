const models = require('../models')
const Util = require('./util')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { model } = require('mongoose')


const createUser = async(request, response)  => {
    const body = request.body
    const existingUser = await models.User.findOne({
        "username":body.username
    })
    const existingUser2 = await models.User.findOne({
        "email":body.email
    })
    if(existingUser || existingUser2){
        return response.status(409).json({
            error: 'username taken',
          })
    }
    const passwordHash = await Util.hashPassword(body.password)
    const user = new models.User ({
        username: body.username, 
        firstName: body.firstName, 
        lastName: body.lastName, 
        passwordHash: passwordHash, 
        email:body.email,
        entries:[]
    })
    const savedUser = await user.save()
    const userForToken = {
        username: savedUser.username,
        id: user.id,
    }
    // generate a token for the registered user 
    const token = jwt.sign(userForToken, process.env.SECRET)
    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
}
const getToken = (request) => {
    const auhorisation = request.get('Authorization')
    if (auhorisation && auhorisation.toLowerCase().startsWith('bearer ')) {
        return auhorisation.substring(7)
    }
    return null
}

const validate = async (request, response) => {
    const token = getToken(request)
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(200).json({status:"unregistered"})
        }else{
            return  response.status(200).json({status:"success", id:decodedToken.id})
        }
    }catch(err){
        return response.status(401).json({status:"unregistered"})
    }
}
const getUser = async (request, response) => {

    const authHeader = request.get('Authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
        const token = authHeader.substring(6)
        try {
            // this will throw an error if token isn't of the right format
            const match = await models.Session.findById(token)  
            if (match) {
                response.json({
                    status: "success",
                    username: match.username,
                    token: match._id
                })       
            }
        } catch { }

    }
    response.json({status: "unregistered"}) 
}
const loginUser = async(request, response) => {
    const {username, password} = request.body
    const user = await models.User.findOne({username})
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
 
    if(!user || !passwordCorrect) {
        response
        .status(401)
        .send({"error":"user does not exist or password incorrect"})
        return
    }
    const userForToken = {
        username: user.username,
        id: user.id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response
    .status(200)
    .send({ token, username: user.username, name: user.firstName })
}

const deleteUserAndEntries = async(request, response) => {
    const body = request.body
    if(!body) {
        return response.status(500).json({ error: "Password not provided" })
    }
    if (!request.get('Authorization')) {
        return response.status(401).json({ status: "unauthenticated" });
    }
    const decodedToken1 = Util.getDecodedToken(Util.getToken(request));
    if (!decodedToken1) {
        return response.status(401).json({ status: "unauthenticated" });
    }
    const userFind = await models.User.findById(decodedToken1.id);
    if(userFind == null) return response.status(401).json({ status: "unauthenticated" });
    
    // const passwordHash = await Util.hashPassword(body.password)
    const passwordCorrect = await bcrypt.compare(body.password, userFind.passwordHash)
    if (!passwordCorrect) {
        return response.status(403).json({ error: "Password incorrect" })
    }
    if (passwordCorrect) {
        const journal = await models.Journal.deleteMany({owner: userFind.id})
        const tag = await models.Tag.deleteMany({owner: userFind.id})
        const user = await models.User.deleteOne({_id:userFind.id})
        return response.status(200).json({ journal,tag,user});
    }

 
}

const getDecodedToken = (token) => {
    return jwt.verify(token, process.env.SECRET)
}
module.exports = {getUser, loginUser,createUser, validate, deleteUserAndEntries}
