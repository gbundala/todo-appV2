// React imports
import React, { useState } from "react";

// Bootstrap imports
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

// Stylesheet import
import "./SingleCarInfo.css";

/**
 *
 * The SingleCarInfo component is mostly a presentational
 * component to display the individual car information documents
 *
 * For efficiency we have included the functionality to allow
 * the user to edit some properties in the document or to delete
 * the entire item. The business logic for handling the UPDATE
 * and DELETE requests have been handed over to the parent
 * component CarsInfoList.
 *
 * However we handle the local state of the individiual cars info
 * in this component including toggling the edit mode to
 * allow the user to edit the car info, also handling the form
 * input control handled by React. These states are local and
 * ephemeral and hence best handled here in the child component
 *
 * An interesting pattern implemented below is the dynamic
 * display of the value of the properties or the Form Control
 * depending on whether the user has toggled the edit mode on
 * or off. This is deemed the efficient and clean pattern rather
 * than having multiple return statements. The JavaScript
 * ternary operator has been useful here!
 */

export default function SingleCarInfo({
  singleCarInfo,
  handleEditCar,
  handleDeleteCar,
}) {
  // Object destructuring of the singleCarInfo
  // We destructure the properties of the object
  // to be used in the below
  const { _id, model, make, color, registrationNumber, owner, address } =
    singleCarInfo;

  // State variables
  const [editMode, setEditMode] = useState(false);
  const [editedCar, setEditedCar] = useState({
    _id,
    model,
    make,
    color,
    registrationNumber,
    owner,
    address,
  });

  // We use a single event handler using the [ and ] braces in
  // line with the guidance in the new React Docs
  // https://beta.reactjs.org/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax
  function handleChange(e) {
    setEditedCar({
      ...editedCar,
      [e.target.name]: e.target.value,
    });
  }

  if (!singleCarInfo) return <p>Add an item to the list</p>;

  return (
    <div>
      <Card className="container py-5 h-100 card-style">
        <Card.Body>
          <Card.Title>
            {editMode ? (
              <FormControl
                name="make"
                value={editedCar.make}
                onChange={handleChange}
              />
            ) : (
              make
            )}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {editMode ? (
              <FormControl
                name="model"
                value={editedCar.model}
                onChange={handleChange}
              />
            ) : (
              model
            )}
          </Card.Subtitle>
          <Card.Text>
            {editMode ? (
              <FormControl
                name="owner"
                value={editedCar.owner}
                onChange={handleChange}
              />
            ) : (
              owner
            )}
          </Card.Text>
        </Card.Body>

        <ListGroup>
          <ListGroupItem>
            {editMode ? (
              <FormControl
                name="color"
                value={editedCar.color}
                onChange={handleChange}
              />
            ) : (
              color
            )}
          </ListGroupItem>
          <ListGroupItem>
            {editMode ? (
              <FormControl
                name="registrationNumber"
                value={editedCar.registrationNumber}
                onChange={handleChange}
              />
            ) : (
              registrationNumber
            )}
          </ListGroupItem>
          <ListGroupItem>
            {editMode ? (
              <FormControl
                name="address"
                value={editedCar.address}
                onChange={handleChange}
              />
            ) : (
              address
            )}
          </ListGroupItem>
        </ListGroup>

        <div className="buttons-wrapper">
          {editMode && (
            <Button
              className="cancel-button"
              variant="light"
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            className="edit-button"
            variant="light"
            onClick={() => {
              if (editMode) {
                handleEditCar(editedCar);
                setEditMode(false);
              } else {
                setEditMode(true);
              }
            }}
          >
            {editMode ? "Done!" : "Update"}
          </Button>

          <Button
            className="delete-button"
            variant="light"
            onClick={() => {
              handleDeleteCar(singleCarInfo);
            }}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
