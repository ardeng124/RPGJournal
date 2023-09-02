const mongoose = require('mongoose')
const config = require('../config')


const journalsSchema = new mongoose.Schema({
  content: {type:String},
  tags: { type : [Object], default:[], ref:'Tags'},
  date: {type: Date, default: Date.now},
  title: {type:String},
  owner: {type: mongoose.Types.ObjectId, ref: 'User', index:true},
  followup: {type:Object, default:{'followup':false,'date':'null', 'level':'null'}}
})

journalsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Journal = mongoose.model('Journal', journalsSchema)


const userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String, unique: false},
  firstName: String,
  lastName: String, 
  passwordHash: String, 
  email: {type: String, unique: true},
  // entries: [
  //   {
  //     type: Object,
  //     ref: 'Journal'
  //   }],
  })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
      returnedObject.id = document._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
  }
})

const User = mongoose.model("User", userSchema);

const tagSchema = new mongoose.Schema({
  name: {type: String, unique:false},
  entryCount: {type: Number},
  owner: {type: mongoose.Types.ObjectId, ref: 'User', index:true},
  })

  tagSchema.set('toJSON', {
  transform: (document, returnedObject) => {
      returnedObject.id = document._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
  }
})

const Tag = mongoose.model("Tag", tagSchema);


const initDB = async () => {
    await mongoose
        .connect(config.mongoDBUrl)
        .catch((error) => {    
            console.log('error connecting to MongoDB:', error.message)  
        })
    }

module.exports = { Journal, initDB, User, Tag}
