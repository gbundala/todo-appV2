// React imports
import React, { useState } from "react";

// Bootstrap imports
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// StyleSheet import
import "./UpdateCars.css";

/**
 *
 * UPDATING MULTIPLE CARS
 *
 * The UpdateCars component is also a presentational component
 * almost similar to the AddCar component
 * to handle the presentation of the user interface that
 * allows for the user to update multiple cars in the database
 *
 * Not much is happening in this component except for the setting
 * of the parent loading state as well as receiving the and
 * firing the handleUpdateMultipleCars event handler from
 * the parent component to invoke the event of updating cars
 *
 */

export default function UpdateMultipleCars({
  setLoading,
  handleUpdateMultipleCars,
}) {
  // State variable
  // We initiate the updatedInfo state variable with the nested
  // object to be sent to the server for storing the updated
  // values in the database

  // Note on Updating nested objects
  // The new react docs provide clear guidance on how to update
  // nested object without mutation by using the spread syntax,
  // both on the outer fields and the nested values
  // Reference: https://beta.reactjs.org/learn/updating-objects-in-state#updating-a-nested-object

  // State variable for updating the fields
  const [updatedInfo, setUpdatedInfo] = useState({
    filter: {
      filterField: "",
      filterValue: "",
    },
    data: {
      model: "",
      make: "",
      color: "",
      registrationNumber: "",
      owner: "",
      address: "",
    },
  });

  // Object Destructuring:
  // We destructure the Object keys to be used below for the data
  const { model, make, color, registrationNumber, owner, address } =
    updatedInfo.data;

  // We also destructure the Object keys for the filter
  const { filterField, filterValue } = updatedInfo.filter;

  // the deep dive section in the new react docs provide
  // incredible guidance on updating the fields in
  // a form using a single event handler
  // https://beta.reactjs.org/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax

  //   Handling the change in the Data
  function handleDataChange(e) {
    // Set the updatedInfo state variable
    setUpdatedInfo({
      ...updatedInfo,
      data: {
        ...updatedInfo.data,
        [e.target.name]: e.target.value,
      },
    });
  }

  //   Handling the change in Filter
  function handleFilterChange(e) {
    // Set the updatedInfo state variable
    setUpdatedInfo({
      ...updatedInfo,
      filter: {
        ...updatedInfo.filter,
        [e.target.name]: e.target.value,
      },
    });
  }

  return (
    <div className="add-car-wrapper">
      <h4 className="add-car-title">Update Multiple Cars</h4>
      <h5 className="sub-title-edit">
        Enter the filter parameters to choose the Car documents to Edit
      </h5>
      <InputGroup className="mb-3 input-group filter-selection">
        <Form.Select
          aria-label="Select Field to Filter"
          placeholder="Enter the Field to Filter"
          name="filterField"
          value={filterField}
          onChange={handleFilterChange}
        >
          <option value="">---Please Choose Field---</option>
          <option value="model">Model</option>
          <option value="make">Make</option>
          <option value="color">Color</option>
          <option value="registrationNumber">Registration Number</option>
          <option value="owner">Owner</option>
          <option value="address">Address</option>
        </Form.Select>

        <FormControl
          placeholder="Enter the Value to Filter"
          name="filterValue"
          value={filterValue}
          onChange={handleFilterChange}
        />
      </InputGroup>

      <h6 className="sub-title-edit">
        Enter the filter parameters to choose the Car documents to Edit
      </h6>
      <InputGroup className="mb-3 input-group">
        <FormControl
          placeholder="Enter Model Year"
          name="model"
          value={model}
          onChange={handleDataChange}
        />

        <FormControl
          placeholder="Enter the Make of the Car"
          name="make"
          value={make}
          onChange={handleDataChange}
        />

        <FormControl
          placeholder="Enter Color"
          name="color"
          value={color}
          onChange={handleDataChange}
        />
      </InputGroup>

      <InputGroup>
        <FormControl
          placeholder="Enter Registration Number"
          name="registrationNumber"
          value={registrationNumber}
          onChange={handleDataChange}
        />

        <FormControl
          placeholder="Enter Current Owner"
          name="owner"
          value={owner}
          onChange={handleDataChange}
        />
      </InputGroup>

      <InputGroup className="last-input-group mb-3 input-group">
        <FormControl
          placeholder="Enter Address of Owner"
          name="address"
          value={address}
          onChange={handleDataChange}
        />

        <Button
          variant="outline-secondary"
          onClick={() => {
            // We ensure that we are only sending the object with
            // fields that have been updated and filter out any
            // empty fields to avoid updating the database with
            // empty fields

            // We initiate these two variables to how the objects
            // that we have modified and ready to send to the
            // server
            let modifiedUpdatedInfo = {};
            let modifiedDataObj = {};

            // We convert the updateInfo.data Object into an
            // array in order to
            // be able to filter out the emptly values below
            let updatedInfoDataArray = Object.entries(updatedInfo.data);

            // We filter out all the array elements with empty
            // strings in the second elements of the
            // two-dimentional array
            let filteredArray = updatedInfoDataArray.filter((c) => {
              return c[1] !== "";
            });

            // Re-convert the array back to object but also
            // change the value of model at index 1 to a number
            // through the parseInt method

            filteredArray.forEach((c) => {
              // If the element updated is the model then we
              // convert the value from a string to a number
              if (c[0] === "model") {
                let key = c[0];
                let value = parseInt(c[1]);

                return (modifiedDataObj[key] = value);
              }

              // For all the remained elements, we just set the
              // key and value in a normal way
              let key = c[0];
              let value = c[1];

              return (modifiedDataObj[key] = value);
            });

            // Reinstate the modified Updated Object with the
            // filter and data fields/keys which contain the
            // nested objects to return the structure of the
            // object in the same manner as it was in the
            // initial state variable
            modifiedUpdatedInfo.filter = updatedInfo.filter;
            modifiedUpdatedInfo.data = modifiedDataObj;

            // we send the modifiedUpdatedInfo object to the
            // server by calling the unhandleUpdateMultipleCars()
            // method with the modified Object to update the
            // database
            // Then we setUpdatedInfo with empty values to clear
            // the input fields
            setLoading(true);
            setUpdatedInfo({
              filter: {
                filterField: "",
                filterValue: "",
              },
              data: {
                model: "",
                make: "",
                color: "",
                registrationNumber: "",
                owner: "",
                address: "",
              },
            });
            handleUpdateMultipleCars(modifiedUpdatedInfo);
          }}
        >
          Update Cars Information
        </Button>
      </InputGroup>
    </div>
  );
}
