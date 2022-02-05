/**
 *
 * TODO LIST MODEL
 *
 * FIXME: USE BCRYPT FOR PASSWORDS
 *
 * Here we define the schema to work with Mongoose.
 * We defined all the fields that will go into the documents
 * that will be created, updated and pulled from the MongoDB
 * database.
 *
 * In the schema definition below, we include the type that
 * each field is expected to carry but also define whether
 * it is required or not and where is not required we define
 * the default value of the field
 */

// Import the mongoose library
const mongoose = require("mongoose");

// Define the TodosSchema to be used to specify the compilation
// of the Todo List model below
let TodosSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  todoList: {
    type: mongoose.Schema.Types.Array,
    required: false,
    default: [],
  },
});

// We create the TodoList model by calling the model()
// method from the
// mongoose library and specify the name of the model "Todos" as
// well as the Schema Object "TodosSchema" defined above
// Documents created in the MongoDB database would represent
// instances of this model and any action to the documents
// are handled by this model
// In essence the model created below is special constructor
// that is compiled based on the above defined schema
module.exports = mongoose.model("Todos", TodosSchema);