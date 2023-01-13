const phonebookRouter = require("express").Router();
const Phonebook = require("../models/people");
const logger = require("../utils/logger");

const now = new Date();

phonebookRouter.get("/hello", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

phonebookRouter.get("/info", (req, res) => {
  Phonebook.find({}).then((people) => {
    res.send(`
      <div>
      <p> Phonebook has info for ${people.length} people </p>
      <p>${now}</p>
      </div>
      `);
  });
});

// posting stuff on api
phonebookRouter.post("/", (request, response, next) => {
  const { body } = request;

  Phonebook.find({}).then((people) => {
    const matchingName = people.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    );
    const matchingNumber = people.find(
      (person) => person.number === body.number
    );

    if (matchingName || matchingNumber) {
      return response.status(400).json({
        error: "name and number must be unique",
      });
    }
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
phonebookRouter.get("/", (req, res) => {
  Phonebook.find({}).then((people) => {
    const container = [];
    people.map((p) => {
      const names = p.name;
      const numbers = p.number;
      const obj = { name: names, numbers };

      container.push(obj);
    });

    res.json(people);
  });
});
// functionality to delete person
phonebookRouter.delete("/:id", (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then((_result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// functionality to show by id and show 404 when an id does not exist
phonebookRouter.get("/:id", (request, response, next) => {
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

phonebookRouter.put("/:id", (request, response, next) => {
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

module.exports = phonebookRouter;
