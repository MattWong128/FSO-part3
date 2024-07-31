require('dotenv').config();
const url = process.env.MONGODB_URI;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const app = express();
let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];
const connectToDatabase = async () => {
  mongoose.set('strictQuery', false);

  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  });
  const Note = mongoose.model('Note', noteSchema);
  try {
    await mongoose.connect(url);
    console.log('DATABASE SUCCESSFULLY CONNECTED ');
  } catch (error) {
    console.log('FAILED ', error);
  }
};

const startServer = async () => {
  await connectToDatabase();

  app.use(express.json());
  app.use(express.static('dist'));
  app.use(cors());
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  app.use(express.json());

  app.use((request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
  });

  app.get('/', (request, response) => {
    response.send('<h1>Hello!</h1>');
  });

  app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find((note) => note.id === id);

    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  });

  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    notes = notes.filter((note) => {
      note.id !== id;
    });

    response.status(204).end('deleted succesfully');
  });
  const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
    return String(maxId + 1);
  };
  app.post('/api/notes', (request, response) => {
    console.log('hello');
    const body = request.body;
    if (!body.content) {
      return response.status(400).json({
        error: 'content missing',
      });
    }

    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    };

    notes = notes.concat(note);

    response.json(note);
  });

  app.get('/api/notes', (request, response) => {
    response.json(notes);
  });

  app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
  });
};

startServer();
