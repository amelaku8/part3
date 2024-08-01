const mongoose = require('mongoose')

require('dotenv').config()

const url = `${process.env.MONGODB_URI}`


mongoose.set('strictQuery',false)
mongoose.connect(url).then(result => console.log('connected to mongodb'))
.catch(error => console.log('error connecting to mongodb:', error.message))


const personSchema = new mongoose.Schema({
    name: {
      type:String,
      minLength:[3,'{VALUE} is not a name'],
      required:true
    },
    number:{type:String,
      minLength:[9,'{VALUE} is short for a number'],
      validate:{
        validator: (v) => /\d{2,3}-\d/.test(v),
        message: props => `${props.value} is not a valid phone number`
        },
      required:true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

                
module.exports = mongoose.model('Person',personSchema)
