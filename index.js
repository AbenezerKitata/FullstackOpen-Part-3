require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Phonebook = require("./models/people");

const app = express();
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "63-23-6423122",
  },
  {
    id: 5,
    name: "Timbuktu Helenas",
    number: "38-55-989652",
  },
  {
    id: 6,
    name: "Harold Davidson",
    number: "25-99-789456",
  },
  {
    id: 7,
    name: "Chikasan Hambertus",
    number: "78-99-109825",
  },
];
const now = new Date();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  res.send(` 
    <div>
    <p> Phonebook has info for ${persons.length} people </p>
    <p>${now}</p>
    </div>
    `);
});

// const getRandomInt = (max) => {
//   return Math.floor(Math.random() * max);
// };
// for posting on the api
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  Phonebook.find({}).then((people) => {
    const matchingName = people.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    );
    const matchingNumber = people.find(
      (person) => person.number === body.number
    );

    // if (matchingName || matchingNumber) {
    //   return response.status(400).json({
    //     error: "name and number must be unique",
    //   });
    // }
    const contact = new Phonebook({
      // id: getRandomInt(10000),
      name: body.name,
      number: body.number,
    });

    contact.save().then((savedContact) => {
      response.json(savedContact);
    });
  });
});

// functionality to get all persons
app.get("/api/persons", (req, res) => {
  Phonebook.find({}).then((people) => {
    let container = [];
    people.map((p) => {
      const names = p.name;
      const numbers = p.number;
      const obj = { name: names, numbers: numbers };

      container.push(obj);
    });

    res.json(people);
  });
});
// functionality to delete person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((contact) => contact.id !== id);

  response.status(204).end();
});

// functionality to show by id and show 404 when an id does not exist
app.get("/api/persons/:id", (request, response) => {
  Phonebook.findById(request.params.id)
    .then((people) => {
      if (people) {
        response.json(people);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
