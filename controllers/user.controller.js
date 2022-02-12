/**
 *
 * USER CONTROLLER
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
 * Design & Architecture of the Database:
 *
 * The database is designed such that there is one collection
 * that will store User documents that contain all the user
 * information as well as the array of todos items.
 *
 * Quering the database is therefore done through finding
 * documents that relate to the authenticated user and only
 * returning that single document, or where the client has
 * made a request to edit or update that document.
 *
 *
 */

// IMPORTS

// Import the Todos model from the model file
const User = require("../models/user.model");

// Import the jsonwebtoken library
const jwt = require("jsonwebtoken");

// Import bcrypt to be used to hash passwords
const bcrypt = require("bcrypt");

// UTILS

// We create a function to generate unique number IDs
// Below is a reference to MDN on random number generation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function createNewID() {
  const newID = Math.floor(Math.random() * Date.now());
  return newID;
}

// We define the function that will be used to create the
function createUserAuthToken(user) {
  // We defined the payload that will be included in the signature
  // algorithm as input. No passwords or sensitive information
  // information is included here. Just information that is
  // relevant to identifiy the user and that is helpful to other
  // parts of the application or the MongoDB database
  const userPayload = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
    _id: user._id.toString(),
  };

  // The 'dotenv' library has already been required/imported
  // in server.js and hence accessible here as well.
  // We grab the jwt secret key from the custom environment
  // variable to be used in the jwt signing method below
  const { JWT_SECRET_KEY } = process.env;

  // We define the authToken variable that will carry the token
  // generated from the signing method.
  // We explicitly define the options to expire the token in 12
  // hours to enhance security as well as define the algorithm to
  // be used to be the 'HS256' hashing algorithm.
  const authToken = jwt.sign(userPayload, JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "12h",
  });

  return authToken;
}

// CONTROLLERS

/* 
    1. Adding a new User to the users collection.
    ------------------------------------------------------------
*/

// Creating a new User in the database
exports.createUser = function (req, res) {
  // Grab the new User object from the body
  const newUser = req.body;

  // FIXME: DELETE LOG
  console.log(newUser);

  // Encrypt the password before storing it in the database
  // using bcrypt hashing algo.
  // We also define the salt rounds to be used in the hashSync
  // bcrypt method below inline with the library documentation.
  // The salt is basically the number of rounds to secure the hash
  // which in essence is meant to enhance the unpredictability of
  // the hash by including some random data that is used as input
  // to the hashing method.
  // Resource on bcrypt: https://sebhastian.com/bcrypt-node/
  const saltRounds = 10;
  const encryptedPassword = bcrypt.hashSync(newUser.password, saltRounds);

  // FIXME: DELETE LOG
  console.log(encryptedPassword);

  // Create and Save a new User using the UserModel constructor
  // and passing in the Object received from the body of the
  // request. Also specifying the password value to the encrypted
  // version instead of the plain text one.
  let userModel = new User({
    ...newUser,
    password: encryptedPassword,
  });

  // FIXME: DELETE LOG
  console.log(userModel);

  // Calling the save method to create the new User
  userModel.save(function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Oops! There is an error in adding the User to the database.",
      });
    } else {
      console.log("Yay! New User has been added to database!!", doc);

      // Generate the auth token using the method defined above
      // by passing in the user doc into the method and calling it
      const authToken = createUserAuthToken(doc);

      // Send the json object to include both the user and the jwt
      // token.
      res.send({
        user: doc,
        token: authToken,
      });
    }
  });
};

/* 
    2. Signing in a User.
    ------------------------------------------------------------
*/

exports.userSignIn = function (req, res) {
  // Plug out the username and password from the body of the request
  // to be used below in accessing the user doc

  const { username } = req.body;
  const { password } = req.body;

  // Calling the findOne() method with the arguments
  User.findOne({ username }, function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).send({
        error: true,
        message: "Oops! There is an error in signing in",
      });
    } else if (!doc) {
      console.log(err);
      res.status(404).send({
        error: true,
        message: "Oops! The username or password entered is not correct!",
      });
    } else {
      // If the doc is found in the database we then use bcrypt
      // to compare the entered username and the encrypted one in
      // the database and only perform the following actions
      // if the comparison succeeds
      bcrypt.compare(password, doc.password, function (err, same) {
        if (err) throw err;

        if (!same) {
          res.status(404).send({
            error: true,
            message: "Oops! The username or password entered is not correct!",
          });
        } else {
          // Generate the auth token using the method defined above
          // by passing in the user doc into the method and calling it
          const authToken = createUserAuthToken(doc);

          // Send the json object to include both the user and the jwt
          // token.
          // FIXME: ENSURE YOU DONT RETURN PASSWORD. USE THE CLEAN USER UTIL. SAME FOR THE SIGNUP METHOD CONTROLLER ABOVE. THE BELOW ALREADY SOLVES THIS HENCE NO NEED FOR A COMPLETE UTIL. REPLICATE IT ABOVE

          // Clone the doc
          let cleanDoc = { ...doc._doc };

          // Delete the password prop
          // Resource: https://stackoverflow.com/questions/56151661/omit-property-variable-when-using-object-destructuring
          delete cleanDoc.password;

          // We only send the clean doc which excludes internal
          // properties such as the password
          res.send({
            user: cleanDoc,
            token: authToken,
          });
        }
      });
    }
  });
};

/* 
    3. Updating information about a single car.
    ------------------------------------------------------------
*/

// TODO: Here while adding/ updating todos ensure that we have the iD generator function being called here to have each element of the array as an objet with id and data: You need to rectify the Schema Model (or maybe not as we are accepting any array okey -- but try to ensure strictness of model for maintainability though dont sweat over it )
// Recall the ID from one of the past tasks

exports.createNewTodoItem = function (req, res) {
  // Call the method above to create a unique id to store in the
  // User document
  const id = createNewID();

  // Grab the todo List array from the body of the request
  // and assign it to the variable. We will then store the
  // array in the User document in the MongoDB database
  const todoListArray = req.body;

  // TODO: WAHAT ARE WE SENDING to the sever to identify the user doc??
  // TODO: In this case there is a need to have the user _id being sent from the front end to the server to be able to identify which object to update hence we must implement JWT before this one -- ie we must authenticate the user before we are able to deal with this part of adding TODolist array to the user Document -- also update the model from Todos model to User model as we are basically dealing with the user and not the toodos in general in the documents

  // TODO: update below
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
