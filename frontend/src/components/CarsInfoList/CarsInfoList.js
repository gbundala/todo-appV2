// React imports
import React, { useEffect, useState } from "react";

// Bootstrap imports
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";

// Components and Stylesheet imports
import AddCar from "../AddCar/AddCar";
import SingleCarInfo from "../SingleCarInfo/SingleCarInfo";
import UpdateMultipleCars from "../UpdateCars/UpdateCars";
import "./CarsInfoList.css";

/**
 *
 * CARS INFO LIST COMPONENT
 *
 * The CarsInfoList component is the main component which
 * handles all the major business logic of this application
 * of making the GET, POST, PUT and DELETE calls to the
 * endpoints exposed by the Express application using the fetch
 * method, and ultimately making the changes or updates to the
 * MongoDB database.
 *
 * The presentational bits of this app have been delegated over
 * to the respective children of this component allowing
 * this component to focus on the logic and data fetching
 * tasks. All event handlers are defined here as well as the
 * main state variables that are relevant to the most part
 * of the application.
 *
 * The useEffect has been used to make the GET request upon
 * mounting of the component on the DOM. Included in the
 * dependency array of the useEffect is the modifiedDocuments
 * state variable which enables the refetching of the documents,
 * from the database by calling the GET method in the useEffect
 * hook.
 *
 * Whereas the event handlers has been used to make the POST, PUT
 * and DELETE request. The PUT and POST method includes headers
 * and body to pass data from the React app to the Express server
 *
 *
 */

export default function CarsInfoList() {
  // State variable for cars List and fetch states
  const [carsInfoList, setCarsInfoList] = useState([]);
  const [modifiedDocuments, setModifiedDocuments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State variable for dropdown
  const [choiceForNewOrMultiple, setChoiceForNewOrMultiple] = useState("");

  // CREATE/POST Request
  function handleAddCar(newCar) {
    fetch("api/addCar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCar),
    })
      .then((res) => res.json())
      .then((data) => {
        // We create a new array that will contain the existing
        // items as well as the newly added item into the database
        // We use the spread '...' syntax to achieve this

        // This is inline with React best practices as noted
        // below in ensuring we don't mutate state
        // Reference: https://beta.reactjs.org/learn/updating-arrays-in-state#adding-to-an-array

        // In addition to the best practice of not mutating state
        // we have also ensured that we only update the added
        // Object that is returned from the database after the
        // database "CREATE" operation is complete to ensure the
        // consistency of the data/state between UI and database
        const updatedCarsInfoList = [...carsInfoList, data];

        // The setStates below will update after the
        // above has finished running due to the state updates
        // being asynchronous (as noted below in the update
        // request handler)
        setCarsInfoList(updatedCarsInfoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in adding new Car: ", err);
      });
  }

  // UPDATE/PUT Single Car Request
  function handleEditCar(editedCar) {
    fetch(`api/updateSingleCar/${editedCar._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedCar),
    })
      .then((res) => res.json())
      .then((data) => {
        // We run the below in the client/frontend here instead
        // of the  running it in the Custom API server and
        // re-return the entire array since this approach is
        // more efficient as we don't want to be resending back
        // the entire array to the frontend each time we update
        // as single arra; that could be an expensive operation
        // for a simple update and may see performance issues
        // when the array is a long list.

        // The map method creates a new array hence we are not
        // mutating the existing array.
        // The map method iterates over the existing list and
        // checks whether the returned Object is the one in
        // the current iteration cycle to return that object,
        // otherwise we return all the other elements that have
        // not been updated/ changed.
        // Reference: https://beta.reactjs.org/learn/updating-arrays-in-state#replacing-items-in-an-array
        const updatedCarsInfoList = carsInfoList.map((carInfo) => {
          if (carInfo._id === data._id) {
            return data;
          } else {
            return carInfo;
          }
        });

        // We can be confident that the map() method will finish
        // running before the setStates below are actually applied
        // to update the state
        // References:
        // 1. https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
        // 2. https://gist.github.com/bpas247/e177a772b293025e5324219d231cf32c
        // 3. https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#render-batching-and-timing
        setCarsInfoList(updatedCarsInfoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in updating Car Information: ", err);
      });
  }

  // UPDATE Multiple Cars Request
  function handleUpdateMultipleCars(updatedInfo) {
    fetch("api/updateMultipleCars", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        // Once the data Object is received from the server
        // we set the state with the count of modified docs
        setModifiedDocuments(data.modifiedCount);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in updating Multiple Cars Information: ", err);
      });
  }

  // DELETE Request
  function handleDeleteCar(deletedCar) {
    fetch(`api/deleteCar/${deletedCar._id}`, {
      method: "DELETE",
      // No headers or body property is being defined here
      // since no data is being sent through the body
      // of the request. We are just specifying the id
      // of the item to be deleted in the params
    })
      .then((res) => res.json())
      .then((data) => {
        // The filter method creates a new array that excludes
        // (filters out) the deleted Object

        // This is inline with React best practices as noted
        // above in ensuring we don't mutate state
        // Reference: https://beta.reactjs.org/learn/updating-arrays-in-state#removing-from-an-array
        const updatedCarsInfoList = carsInfoList.filter((carInfo) => {
          return carInfo._id !== data._id;
        });

        // The setStates below will update after the filter method
        // above has finished running due to the state updates
        // being asynchronous (as noted above in the update
        // request)
        setCarsInfoList(updatedCarsInfoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in deleting Car: ", err);
      });
  }

  // GET Request for Cars older than 5 Years
  function handleFetchOldCars() {
    fetch("/api/old")
      .then((res) => res.json())
      .then(
        (data) => {
          setCarsInfoList(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err);
          setLoading(false);
          console.error("Error in fetching data: ", err);
        }
      );
  }

  useEffect(() => {
    // this variable is useful to determine when to set the
    // carsInfoList state variable. We therefore set the ignore
    // setting state variable to true in the return statement
    // to avoid setting the state process when the component
    // is unmounted from the DOM
    let ignoreSettingState = false;

    // GET Request
    // fetching the data from our Custom API and managing it
    // we use the endpoints exposed by our restful API
    // in the fetch method below
    // Further we parse json() on the response since we receive
    // the data in json format from our Custom API
    // then we set the data in the state variable
    fetch("/api")
      .then((res) => res.json())
      .then(
        (data) => {
          if (!ignoreSettingState) setCarsInfoList(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err);
          setLoading(false);
          console.error("Error in fetching data: ", err);
        }
      );

    // Clean Up
    return () => {
      // we set the ignorSettingState variable to true
      // in order to avoid setting the state variable
      // carsInfoList when this component is
      // unmounted from the DOM or when it no longer
      // exists in the DOM tree
      ignoreSettingState = true;
    };
  }, [modifiedDocuments]);

  return (
    <div className="main-wrapper">
      <h1>Cars Information Listing</h1>

      <div className="select-wrapper">
        <Form.Select
          aria-label="Selecting choice for new car or updating multiple cars"
          value={choiceForNewOrMultiple}
          onChange={(e) => {
            setChoiceForNewOrMultiple(e.target.value);
          }}
        >
          <option value="">---Choose Adding New Car or Update Cars---</option>
          <option value="newCar">Add New Car</option>
          <option value="updateCars">Update Multiple Cars</option>
        </Form.Select>

        <Button
          variant="outline-secondary"
          className="search-old-cars"
          onClick={handleFetchOldCars}
        >
          Search Cars Older Than 5 Years
        </Button>
      </div>

      {choiceForNewOrMultiple === "updateCars" && (
        <UpdateMultipleCars
          setLoading={setLoading}
          handleUpdateMultipleCars={handleUpdateMultipleCars}
        />
      )}

      {choiceForNewOrMultiple === "newCar" && (
        <AddCar setLoading={setLoading} handleAddCar={handleAddCar} />
      )}

      {loading && <p>Loading...</p>}

      {error && <p>Something is wrong!</p>}

      {modifiedDocuments && (
        <p className="modified-documents">
          Congrats! {modifiedDocuments} Cars have been updated!
        </p>
      )}

      <div className="cars-details-wrapper">
        {carsInfoList &&
          carsInfoList.map((carInfo) => {
            return (
              <SingleCarInfo
                key={carInfo._id}
                singleCarInfo={carInfo}
                handleEditCar={handleEditCar}
                handleDeleteCar={handleDeleteCar}
              />
            );
          })}
      </div>
    </div>
  );
}
