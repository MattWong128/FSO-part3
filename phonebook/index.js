const express = require("express");
const app = express();
const PORT = 3001;
const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.listen(PORT, "localhost", () => console.log("listening on port ", PORT));

app.get("/", (req, res) => res.send("hello"));

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info ${persons.length} on people <br/> ${date.toString()}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id == id);

  if (!person) return res.status(404).end("person not found");
  res.status(200).send(person);
});
