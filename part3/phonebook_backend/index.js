const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(morgan(":method :url :status - :response-time ms :body"))

// データ
let personsList = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// get
app.get(`/api/persons`, (request, response) => {
    response.json(personsList)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const target = personsList.find(p => p.id === id)
    console.log(target)
    if (target) {
        response.json(target)
    } else {
        response.status(404).end()
    }
})

app.post("/api/persons", (request, response) => {
    const id = String(Math.floor(Math.random() * (100000)))
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "We can't find the name or the number. Fill in."
        })
    } else if (personsList.map(p => p.name).includes(body.name)) {
        return response.status(400).json({
            error: "Posted name is already in phonebook. Name must be unique"
        })
    }

    const newPerson = {id, ...body}
    
    personsList = personsList.concat(newPerson)

    response.json(newPerson)

})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    personsList = personsList.filter(p => p.id !== id)
    
    response.status(204).end()
})

app.get("/info", (request, response) => {
    const registered = personsList.length
    const now = new Date()
    response.send(
        `<p>Phonebook has info for ${registered} people</p>
        <p>${now}</p>`
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})