const mongoose = require('mongoose')
const config = require('../config')

const sessionSchema = new mongoose.Schema({
    username: {type: String, unique: true}
  })

sessionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Session = mongoose.model('Session', sessionSchema)

const conversationSchema = new mongoose.Schema({
    title: String,
    creator: {type: mongoose.Types.ObjectId, ref: 'Session'}
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  })

conversationSchema.virtual('messages', {
    ref: 'Message', // The model to use
    localField: '_id', // Find messages where `localField`
    foreignField: 'conversation', // is equal to `foreignField`
    count: true // And only get the number of docs
  });

conversationSchema.methods.toJSON = function () {
    const cObj = this.toObject()
    cObj.id = cObj._id.toString()
    delete cObj._id
    delete cObj.__v
    return cObj
}

const Conversation = mongoose.model('Conversation', conversationSchema)

const messageSchema = new mongoose.Schema({
    text: String,
    timestamp: {type: Date, default: Date.now},
    creator: {type: mongoose.Types.ObjectId, ref: 'Session'},
    conversation: {type: mongoose.Types.ObjectId, ref: 'Conversation'}
  })

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()

    if (document.creator) {
      returnedObject.creator = document.creator.username
    }

    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Message = mongoose.model('Message', messageSchema)

const initDB = async () => {
    await mongoose
        .connect(config.mongoDBUrl)
        .catch((error) => {    
            console.log('error connecting to MongoDB:', error.message)  
        })
    }

module.exports = { Session, Conversation, Message, initDB }
