if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
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
  //const id = Number(req.params.id);
  //const person = persons.find(person => person.id === id);
  
  //person
  //  ? res.json(person)
  //  : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(e => next(e))
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  //if (persons.find(p => p.name === body.name)) {
  //  return res.status(400).json({
  //    error: 'name must be unique'
  //  })
  //}

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

const errorHandler = (e, req, res, next) => {
  console.error(e.message);

  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});