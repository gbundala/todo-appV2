/**
 *
 * CARS CONTROLLER
 *
 * Here we define all the CRUD operations operations in the
 * callback functions that will be called when the route
 * end-points are hit by a request.
 *
 * These functions are stored in variables and exported to
 * be used in the routes directory (we have put them together
 * in one index.js file for simplicity and maintanability of code)
 *
 * These methods defined here as controllers ultimately call
 * the various mongoose methods for constructing and querying
 * the data in the MongoDB database through the documents which
 * are instances of models.
 *
 */

// Import the Cars model from the model file
const Cars = require("../models/cars.model");

/* 
    1. Adding a car to the cars collection.
    ------------------------------------------------------------
*/

// Creating a new car in the database
exports.createCar = function (req, res) {
  // Grab the new car object from the body
  const newCar = req.body;

  // Create and Save a new car using the Car Model constructor
  // and passing in the Object received from the body of the
  // request
  let carModel = new Cars({
    ...newCar,
  });

  // Calling the save method to create the Car
  carModel.save(function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Oops! There is an error in adding the car to the database.",
      });
    } else {
      console.log("Yay! New car has been added to database!!", doc);
      res.send(doc);
    }
  });
};

/* 
    2. Updating information about a single car.
    ------------------------------------------------------------
*/

exports.updateSingleCar = function (req, res) {
  // Grab the id of the car to be updated in the req params
  const id = String(req.params.id);

  // Grab the updated object
  const updatedFields = req.body;

  // We use the id field in the query filter to update the docs
  // The ids are uniquely generated by MongoDB upon doc creation
  // Hence we ensure that we update the correct doc
  // We set the 'new: true' option to return the updated doc
  // Also included the '$set' update operator to ensure we don't
  // overwrite any field not updated

  // The findByIdAndUpdate provides much better Developer
  // Experience and maintainability of the code than
  // findOneAndUpdate
  // Reference: https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate

  Cars.findByIdAndUpdate(
    id,
    { $set: { ...updatedFields } },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("Oops! Something went wrong when updating data!");
        res.send("ERROR: Car has Not been Updated. " + err);
      }
      console.log("Yay! Car has been Updated!!", doc);

      // We send back to the frontend the document/object that
      // has been updated in order to replace it out from the
      // array/state in UI and re-render.
      res.send(doc);
    }
  );
};

/* 
    3. Updating information about more than one car.
    ------------------------------------------------------------
*/

exports.updateMultipleCars = function (req, res) {
  // Grab the info about the filter (field and value)
  // and store in the query constant
  const { filterField } = req.body.filter;
  let { filterValue } = req.body.filter;

  // if (filterField === "model") {
  //   filterValue = parseInt(req.body.filter);
  // }

  const queryFilter = { [filterField]: filterValue };

  // Grab the actual data from the body of the req
  const updatedFields = req.body.data;

  // Updating Multiple docs
  Cars.updateMany(
    queryFilter,
    { $set: { ...updatedFields } },
    { new: true },
    function (err, docs) {
      if (err) {
        console.log("Oops! Something went wrong when updating data!");
        res.send("ERROR: Cars have Not been Updated. " + err);
      }
      console.log("Yay! The Cars have been Updated!!!", docs);
      res.send(docs);
    }
  );
};

/* 
    4. Deleting a specific document.
    ------------------------------------------------------------
*/

// Deleting a specific document
// The docs suggests to use findOneAndDelete() over
// findOneAndRemove().
// Reference: https://mongoosejs.com/docs/api.html#model_Model.findOneAndDelete
exports.deleteCar = function (req, res) {
  // Grab the id of the car to be deleted in the req params
  const id = String(req.params.id);

  Cars.findByIdAndDelete(id, function (err, doc) {
    if (err) {
      console.log("ERROR: Car is NOT Deleted. " + err);
      res.send("ERROR: Car is NOT Deleted. " + err);
    }
    console.log("Yay! The car has been deleted!", doc);

    // We send back to the frontend the document/object that
    // has been deleted in order to filter it out from the
    // state in UI and re-render.
    res.send(doc);
  });
};

/* 
    5. Listing all the information for all cars in the database
    ------------------------------------------------------------
*/

// Retrieving all the information for all cars in the database
exports.findAllCars = function (req, res) {
  Cars.find(function (err, carsDocs) {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Oops! There is an error in retrieving cars from the database",
      });
    } else {
      res.send(carsDocs);
    }
  });
};

/* 
    6. Listing model, make, registration number and current
    owner for all cars older than 5 years.
     ------------------------------------------------------------
*/

// Listing model, make, registration number and current owner for
//  all cars older than 5 years in the database
// We specify the fields that we want to return in the projection
// part of the parameters. While we define the filter that is of
// interest, in this case cars with models less than five years
// ago from the current Year.
exports.findAllCarsOlderThan5Years = function (req, res) {
  // We compute the year that is 5 Years Ago from today
  // We do this formula for maintainability instead of
  // hardcoding the actual Year which is five years ago
  const fiveYearsAgo = new Date().getFullYear() - 5;

  // Calling the find() method with the arguments
  Cars.find(
    { model: { $lt: fiveYearsAgo } },
    {
      model: true,
      make: true,
      registrationNumber: true,
      owner: true,
    },
    function (err, carsDocs) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message:
            "Oops! There is an error in retrieving cars older than 5 years from the database",
        });
      } else {
        res.send(carsDocs);
      }
    }
  );
};
