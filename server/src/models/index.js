const mongoose = require('mongoose')
const config = require('../config')

const journalsSchema = new mongoose.Schema({
  content: {type:String},
  tags: { type : [Object], default:[], ref:'Tags'},
  date: {type: Date, default: Date.now},
  Title: {type:String},


})

journalsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Journal = mongoose.model('Journal', journalsSchema)
const initDB = async () => {
    await mongoose
        .connect(config.mongoDBUrl)
        .catch((error) => {    
            console.log('error connecting to MongoDB:', error.message)  
        })
    }

module.exports = { Journal, initDB }
