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

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const contact = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  persons = persons.concat(contact)

  response.json(contact)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(contact => contact.id !== id)

  response.status(204).end()
})

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