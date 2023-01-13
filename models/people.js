/* eslint-disable no-underscore-dangle */
require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "minimum 3 characters"],
    required: [true, "name required"],
    // unique: [true, "cannot register a duplicate name"],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator(v) {
        return /\d{2,3}-?\d{0,3}-\d{4,8}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! use ooo-ooo-oooo format`,
    },
    required: [true, "number required"],
    // unique: [true, "this number already exists"],
  },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-param-reassign
    delete returnedObject._id;
    // eslint-disable-next-line no-param-reassign
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Phonebook", phonebookSchema);
