if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const axios = require('axios');
const Person = require('./models/Person');

app.use(express.json());
app.use(express.static('build'));

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p> ${String(Date())} </p>
      `)
    })
    .catch(e => next(e))
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(e => next(e))
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(e => next(e))
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(e => next(e))
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save()
    .then(returnedPerson => {
      res.json(returnedPerson)
    })
    .catch(e => next(e))
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(e => next(e))
});

const errorHandler = (e, req, res, next) => {
  console.error(e.message);

  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message })
  }

  next(e)
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});