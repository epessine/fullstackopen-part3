const e = require('express');
const mongoose = require('mongoose')

const url = process.env.DB_URI;

console.log('connecting to', url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => {
    console.log('connected to MongoDB')  })
  .catch(e => {
    console.log('error connecting to MongoDB:', e.message)
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Person', personSchema);