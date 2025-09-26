require("dotenv").config()
const Person = require("./models/person")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(morgan(":method :url :status - :response-time ms :body"))


// get
app.get(`/api/persons`, (request, response) => {
    Person.find({}).then(persons => {
        console.log(persons)
        response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        console.log(person)
        response.json(person)
    })
    .catch(error => {
        next(error)
    })

})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "We can't find the name or the number. Fill in."
        })
    } 

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => {
        next(error)
    })

})

app.put("/api/persons/:id", (request, response, next) => {
    const { number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            console.log(person)
            person.number = number

            person.save().then(updatedPerson => {
                console.log(updatedPerson)
                response.json(updatedPerson)
            })
        })
        .catch(error => {
            next(error)
        })
}) 

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(res => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get("/info", (request, response) => {
    Person.find({}).then(personsList => {
        const now = new Date()
        response.send(
            `<p>Phonebook has info for ${personsList.length} people</p>
            <p>${now}</p>`
        )
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

const errorHanlder = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === "CastError") {
        return response.status(400).send({error: "malformatted id"})
    } else if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHanlder)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})