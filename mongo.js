const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

console.log('Connecting to MongoDB...');
const name = process.argv[2];
const number = process.argv[3];

const url = `mongodb+srv://${user}:${password}@cluster0.pl1hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => console.log('Success!'))
  .catch(e => console.log('error:',e));

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if(process.argv.length === 2) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:');
      persons.forEach(person => console.log(person.name, person.number));
      mongoose.connection.close()
    })
    .catch(e => console.log('error:',e))
} else if (process.argv.length === 4) {
  const person = new Person({
    name: name,
    number: number
  });
  
  person.save()
    .then(res => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
    .catch(e => console.log('error:',e));
}
