const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://aben4kit:${password}@cluster0.j2qmqfs.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Phonebook = mongoose.model("Phonebook", phonebookSchema);
// eslint-disable-next-line no-unused-expressions
process.argv[3]
  ? mongoose
      .connect(url)
      .then(() => {
        // console.log("connected");

        const phonebook = new Phonebook({
          name: process.argv[3],
          number: process.argv[4],
        });

        return phonebook.save();
      })
      .then(() => {
        console.log(
          `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
        );
        return mongoose.connection.close();
      })
      .catch((err) => console.log(err))
  : mongoose.connect(url).then(() => {
      console.log("phonebook:");
      Phonebook.find({}).then((result) => {
        result.forEach((phonebook) => {
          console.log(`${phonebook.name} ${phonebook.number}`);
        });
        mongoose.connection.close();
      });
    });
