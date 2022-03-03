// React imports
import React, { useState } from "react";

// React-bootstrap imports
import Button from "react-bootstrap/esm/Button";
import FormControl from "react-bootstrap/FormControl";
import ListGroupItem from "react-bootstrap/ListGroupItem";

// Stylesheet import
import "./TodoItem.css";

/**
 *
 * Todo Item Component
 *
 * This component handles the individual presentation and UI
 * for the todo items. The component also allows for the
 * triggering of the various events relating to the individual
 * todo Items. These are such as edit or deleting the todo item.
 *
 * The event handler functions are defined in the parent TodoList
 * component, however they are called in this component upon
 * event firing.
 *
 * An important creative feature in this component is the dynamic
 * rendering of either the form control or list item depending
 * on the state whether it is in "update mode" or in normal mode.
 * The respective buttons and event handler calls have been
 * structured and aligned in such manner.
 *
 */
export default function TodoItem({
  todo,
  handleDeleteTodoItem,
  handleEditTodoItem,
}) {
  // State variables
  const [updateMode, setUpdateMode] = useState(false);
  const [updatedValue, setUpdatedValue] = useState(todo.todoItem);

  // Destructure the todoId to be used below in multiple places
  const { todoId, todoItem } = todo;

  return (
    <div className="todo-item-wrapper">
      {updateMode ? (
        <FormControl
          className="form-control-wrapper"
          value={updatedValue}
          onChange={(e) => {
            setUpdatedValue(e.target.value);
          }}
        />
      ) : (
        <ListGroupItem>{todoItem}</ListGroupItem>
      )}
      <div className="todo-item-buttons">
        {updateMode ? (
          <Button
            variant="outline-success"
            onClick={() => {
              handleEditTodoItem(todoId, updatedValue);
              setUpdateMode(false);
            }}
          >
            &#10003;
          </Button>
        ) : (
          <Button
            variant="outline-primary"
            onClick={() => {
              setUpdateMode(true);
            }}
          >
            &#9998;
          </Button>
        )}
        <Button
          variant="outline-danger"
          onClick={() => {
            handleDeleteTodoItem(todoId);
          }}
        >
          &#10005;
        </Button>
      </div>
    </div>
  );
}
