require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Note = require('./models/note');

const PORT = process.env.PORT;
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

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});
//To do
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  Note.findById(request.params.id)
    .then((note) => {
      if (!note)
        response.json({
          error: `ID ${id} does not exist`,
        });
      else response.json(note);
    })
    .catch((err) => {
      // Error occurred during the query
      response.status(500).json({
        error: 'Invalid ID: must be 24 charcters long / contains only hexdecimal',
      });
    });
});

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => {
    note.id !== id;
  });

  response.status(204).end('deleted succesfully');
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note.save().then((savedNote) => response.json(savedNote));
});

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
});
