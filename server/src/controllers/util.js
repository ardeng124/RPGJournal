const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const getToken = (request) => {
    const authorisation = request.get('Authorization')

    if (authorisation && authorisation.toLowerCase().startsWith('bearer ')) {
        return authorisation.substring(7)
    }
    return null
}
const getDecodedToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET)
    }catch(error){
        return null
    }
}
const hashPassword =  async (plainTextPassword) =>{
    const saltRounds = 10
    return bcrypt.hash(plainTextPassword, saltRounds)
    
}

module.exports = {
    getToken, 
    getDecodedToken, 
    hashPassword
}