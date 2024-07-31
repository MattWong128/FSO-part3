const mongoose = require('mongoose');
const { Schema } = mongoose;
if (process.argv.length < 5) {
  console.log('give password as argument');
  process.exit(1);
}
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

//mongodb+srv://user:ltRvk6bH7SXYoler@cluster0.6dobhny.mongodb.net/

const url = `mongodb+srv://user:${password}@cluster0.6dobhny.mongodb.net/`;
mongoose.set('strictQuery', false);

mongoose
  .connect(url)
  .then((res) => console.log('connected ', res))
  .catch((err) => console.log('FAILED ', err));

const personSchema = new Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: name,
  number: number,
});
person.save().then((res) => {
  console.log(res);
  mongoose.connection.close();
});
