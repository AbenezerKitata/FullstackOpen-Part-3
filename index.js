const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "63-23-6423122"
    },
    { 
      "id": 5,
      "name": "Timbuktu Helenas", 
      "number": "38-55-989652"
    }
    ,
    { 
      "id": 6,
      "name": "Harold Davidson", 
      "number": "25-99-789456"
    },
    { 
      "id": 7,
      "name": "Chikasan Hambertus", 
      "number": "78-99-109825"
    }
]
const now = new Date()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(` 
    <div>
    <p> Phonebook has info for ${persons.length} people </p>
    <p>${now}</p>
    </div>
    `)
  })

const getRandomInt = (max)=> {
    return Math.floor(Math.random() * max);
  }
// for posting on the api
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  const matchingName = persons.find(person=> person.name.toLowerCase() === body.name.toLowerCase() )
  const matchingNumber = persons.find(person=>person.number === body.number)

  if(matchingName || matchingNumber){
    return response.status(400).json({
        error: 'name and number must be unique'
    })
  }

  const contact = {
    id: getRandomInt(10000),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(contact)

  response.json(contact)
})
// functionality to get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})
// functionality to delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(contact => contact.id !== id)

  response.status(204).end()
})

// functionality to show by id and show 404 when an id does not exist
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = persons.find(contact => contact.id === id)

  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})