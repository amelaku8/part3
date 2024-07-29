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
        
       
        Person.findByIdAndUpdate(request.params.id,person,{new:true}).
        then(updatedPerson => {response.json(updatedPerson);console.log(updatedPerson)}).catch(error => next (error))

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
app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    Person.findById(id).then(person => {
        if(person){
            response.json(person)
        }
        else(
            response.status(404).end()
        )
    }).catch(error =>next(error))
    })

app.delete('/api/persons/:id',(request,response) =>{
    const id = request.params.id
    Person.findByIdAndDelete(id).then(
        result => response.status(204).end()
        
    ).catch(error=> next(error))
})

app.post('/api/persons',(request,response) =>{
    const body = request.body
    if(!body.name){
        return response.status(400).json({
            error: "name missing"
        })
    }
    if(!body.number){
        return response.status(400).json({
            error: "number missing"
        })
    }
    
    const person = new Person({
        name:body.name,
        number:body.number,})
    
        
    person.save().then(savedPerson=>
    {
        response.json(savedPerson)
    }
    )    

})





const errorHandler = (error,request,response,next) =>{
    console.error(error.message)
    next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
