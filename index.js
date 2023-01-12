require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Phonebook = require("./models/people");
const app = express();
const now = new Date();
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/hello", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  Phonebook.find({}).then((people) => {
    res.send(` 
      <div>
      <p> Phonebook has info for ${people.length} people </p>
      <p>${now}</p>
      </div>
      `);
  });
});

// const getRandomInt = (max) => {
//   return Math.floor(Math.random() * max);
// };
// for posting on the api
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

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
      name: body.name,
      number: body.number,
    });

    contact
      .save()
      .then((savedContact) => {
        response.json(savedContact);
      })
      .catch((error) => next(error));
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
app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// functionality to show by id and show 404 when an id does not exist
app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((people) => {
      if (people) {
        response.json(people);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error("name of error", error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
