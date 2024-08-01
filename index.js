const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require("./models/person")

const app =express()

morgan.token('tpe', function (req, res) { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :tpe'))

app.put('/api/persons/:id', (request,response,next) =>
    {
        const person = {
            name:request.body.name,
            number:request.body.number
        }
        
       
        Person.findByIdAndUpdate(
            request.params.id,person,
            {new:true,runValidators:true,context:'query'})
            .then(updatedPerson => {response.json(updatedPerson)}).catch(error => next (error))

    })

app.get('/api/persons/',(request,response)=>{
  Person.find({}).then(person =>{
    response.json(person)
  })
}
)

app.get('/info/',(request,response) =>{
    Person.countDocuments().then( result => {
    response.send(
        `<div>
            <p>Phonebook has info for ${result} people </p>
            <p>${new Date()} </p>
        </div>`   )})
})

app.get('/api/persons/:id',(request,response,next)=>{
    const id = request.params.id
    Person.findById(id).then(person => {
        if(person){
            response.json(person)
        }
        
    }).catch(error =>next(error))
    })

app.delete('/api/persons/:id',(request,response) =>{
    const id = request.params.id
    Person.findByIdAndDelete(id).then(
        result => response.status(204).end()
        
    ).catch(error=> next(error))
})

app.post('/api/persons',(request,response,next) =>{
    const body = request.body
    
    const person = new Person({
        name:body.name,
        number:body.number,})
    
        
    person.save().then(savedPerson=>
    {
        response.json(savedPerson)
    }
    ).catch( error => next(error) )    

})





const errorHandler = (error,request,response,next) =>{
    if (error.name ==='ValidationError'){
        return response.status(400).json({error:error.message})
    }

}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})