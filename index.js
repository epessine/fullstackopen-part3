if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const Person = require('./models/Person');

app.use(express.json());
app.use(express.static('build'));

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p> ${String(Date())} </p>
      `)
    })
    .catch(e => console.log('error retrieving data:', e))
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(e => console.log('error retrieving data:', e))
});

app.get('/api/persons/:id', (req, res) => {
  //const id = Number(req.params.id);
  //const person = persons.find(person => person.id === id);
  
  //person
  //  ? res.json(person)
  //  : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  //const id = Number(req.params.id);
  //persons = persons.filter(person => person.id !== id);
  //
  //res.status(204).end();
});

app.post('/api/persons', (req, res) => {
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
    .catch(e => console.log('error saving data:', e))
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});