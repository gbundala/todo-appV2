// Import the express library
const express = require("express");

// Create an apiRouter object by calling the Router() method
// on the express library
const apiRouter = express.Router();

// Import the cars controller
const cars = require("../controllers/cars.controller.js");

// ROUTERS

// 1. POST Request to add a car to the cars collection
apiRouter.post("/addCar", cars.createCar);

// 2. PUT Request to Update Information about a Single Car
apiRouter.put("/updateSingleCar/:id", cars.updateSingleCar);

// 3. PUT Request to Update Information on Multiple Cars
apiRouter.put("/updateMultipleCars", cars.updateMultipleCars);

// 4. DELETE Request to delete a specific document of a car
apiRouter.delete("/deleteCar/:id", cars.deleteCar);

// 5. GET Request to access the list of all cars
apiRouter.get("/", cars.findAllCars);

// 6. GET Request to access the list of all cars older
// than 5 years
apiRouter.get("/old", cars.findAllCarsOlderThan5Years);

// Exporting the module
module.exports = apiRouter;