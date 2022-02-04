/**
 *
 * CARS MODEL
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

// Define the CarsSchema to be used to specify the compilation
// of the Cars model below
let CarsSchema = mongoose.Schema({
  model: {
    type: Number,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
    default: "unknown",
  },
});

// We create the Cars model by calling the model() method from the
// mongoose library and specify the name of the model "Cars" as
// well as the Schema Object "CarsSchema" defined above
// Documents created in the MongoDB database would represent
// instances of this model and any action to the documents
// are handled by this model
// In essence the model created below is special constructor
// that is compiled based on the above defined schema
module.exports = mongoose.model("Cars", CarsSchema);
