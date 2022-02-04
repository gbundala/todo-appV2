// React imports
import React, { useState } from "react";

// Bootstrap imports
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

// Yup imports
import * as yup from "yup";

// Stylesheet import
import "./AddCar.css";

/**
 *
 * The AddCar component is also a presentational component
 * to handle the presentation of the user interface that
 * allows for the user to add a new car to the database
 *
 * Not much is happening in this component except for the setting
 * of the parent loading state as well as receiving the and
 * firing the handleAddCar event handler from the parent
 * component to invoke the event of adding a new car
 */

export default function AddCar({ setLoading, handleAddCar }) {
  // State variables for the new car
  const [newCar, setNewCar] = useState({
    model: "",
    make: "",
    color: "",
    registrationNumber: "",
    owner: "",
    address: "",
  });

  // Validation state
  const [isValid, setIsValid] = useState(false);

  // Yup Schema

  // Yup Schema has been used to ensure that the proper
  // values are sent to the server and recorded in the database
  // Also to ensure no errors in managing the received data
  // from the front-end. Yup is a popular library usually
  // used along side Formik another popular React and React Native
  // library used for forms.
  // Reference: https://github.com/jquense/yup
  let yupSchema = yup.object({
    model: yup.number().required("Required").positive().integer(),
    make: yup.string().required("Required"),
    color: yup.string().required("Required"),
    registrationNumber: yup.string().required("Required"),
    owner: yup.string().required("Required"),
    address: yup.string(),
  });

  // We destructure the Object keys to be used below
  const { model, make, color, registrationNumber, owner, address } = newCar;

  // We check whether the form is valid to be submitted by
  // ensuring that there is no empty field that is required
  // as per the Schema specifications in the backend.
  // We store that value in the "isValid" state variable
  // as defined above

  // the deep dive section in the new react docs provide
  // incredible guidance on updating the fields in
  // a form using a single event handler
  // https://beta.reactjs.org/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax
  function handleChange(e) {
    setNewCar({
      ...newCar,
      [e.target.name]: e.target.value,
    });
    setIsValid(
      yupSchema.isValidSync({ ...newCar, [e.target.name]: e.target.value })
    );
  }

  return (
    <div className="add-car-wrapper">
      <h4 className="add-car-title">Add a New Car</h4>
      <InputGroup className="mb-3  input-group">
        <FormControl
          placeholder="Enter Model Year"
          name="model"
          value={model}
          onChange={handleChange}
        />

        <FormControl
          placeholder="Enter the Make of the Car"
          name="make"
          value={make}
          onChange={handleChange}
        />

        <FormControl
          placeholder="Enter Color"
          name="color"
          value={color}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <FormControl
          placeholder="Enter Registration Number"
          name="registrationNumber"
          value={registrationNumber}
          onChange={handleChange}
        />

        <FormControl
          placeholder="Enter Current Owner"
          name="owner"
          value={owner}
          onChange={handleChange}
        />

        <FormControl
          placeholder="Enter Address of Owner"
          name="address"
          value={address}
          onChange={handleChange}
        />

        <Button
          variant="outline-secondary"
          onClick={() => {
            //  We only allow the sending of data if
            // the form is valid
            if (isValid) {
              setLoading(true);
              setNewCar({
                model: "",
                make: "",
                color: "",
                registrationNumber: "",
                owner: "",
                address: "",
              });
              handleAddCar(newCar);
            }
          }}
          disabled={!isValid}
        >
          Add New Car
        </Button>
      </InputGroup>
    </div>
  );
}
