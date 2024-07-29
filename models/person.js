const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log(url)

mongoose.set('strictQuery',false)
mongoose.connect(url).then(result => console.log('connected to mongodb'))
.catch(error => console.log('error connecting to mongodb:', error.message))


const personSchema = new mongoose.Schema({
    name: String,
    number:Number
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
                
module.exports = mongoose.model('Person',personSchema)