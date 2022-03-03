// React imports
import React, { useState } from "react";

// React-bootstrap imports
import Button from "react-bootstrap/esm/Button";
import FormControl from "react-bootstrap/FormControl";

// Import stylesheet
import "./TodoInput.css";

/**
 *
 * Todo Input Component
 *
 * This component is mainly a presentational component similar
 * to the TodoItem component. It has its own local state
 * to handle the ephemeral state of the input control. The
 * rest of the code base is mainly to handle the user inputing
 * their todos and triggering the event of sending it to
 * the backend.
 *
 * The event handler for adding the todo is defined in the
 * parent component which handles sending the data to the
 * backend and the database
 *
 * As a UX bonus, We included the disabled prop and the
 * expression to evaluate in order to avoid the user
 * sinadvertently adding an emptly task
 *
 */

function TodoInput({ handleAddTodoItem }) {
  // State variables
  const [inputText, setInputText] = useState("");

  // We use the controlled input pattern hence the state
  // on every keystroke
  function handleChange(e) {
    setInputText(e.target.value);
  }

  return (
    <div className="todo-input-wrapper">
      <label>
        <h3 className="form-label-wrapper">What needs to be done?</h3>
        <FormControl
          onChange={handleChange}
          value={inputText}
          name="todoText"
          type="text"
          placeholder="Write Your Todo!"
        />
      </label>

      <Button
        disabled={!inputText}
        onClick={() => {
          // Call the event handler defined in parent component
          handleAddTodoItem(inputText);

          // Clear the input area
          setInputText("");
        }}
      >
        Add Todo
      </Button>
    </div>
  );
}

export default TodoInput;
