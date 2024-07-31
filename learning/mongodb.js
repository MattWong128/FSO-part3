const mongoose = require('mongoose');
const { Schema } = mongoose;
//mongodb+srv://user:ltRvk6bH7SXYoler@cluster0.6dobhny.mongodb.net/

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://user:${password}@cluster0.6dobhny.mongodb.net/`;
mongoose.set('strictQuery', false);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.log('connected');
  } catch (error) {
    console.log('FAILED ', error);
  }
};

const saveToDatabase = async () => {
  try {
    await person.save();
    console.log(`added name ${name} number ${number} to phonebook`);
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
};

const personSchema = new Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Person', personSchema);
const person = new Person({
  name: name,
  number: number,
});

connectToDatabase();
saveToDatabase();
