import React, { useState } from "react";

function TodoInput({ handleAddTodoItem }) {
  const [inputText, setInputText] = useState("");

  // We use the controlled input pattern hence hance the state on every keystroke
  function handleChange(e) {
    setInputText(e.target.value);
  }

  // TODO: WORK ON THE INPUT
  return (
    <>
      <label>
        Whats needs to be done?
        <input
          onChange={handleChange}
          value={inputText}
          name="todoText"
          type="text"
          placeholder="todo item"
        />
      </label>

      {/* As a UX bonus, We included the disabled prop and the expression to evaluate in order to avoid the user inadvertently adding an emptly task */}
      <button
        disabled={!inputText}
        onClick={() => {
          handleAddTodoItem(inputText);
        }}
      >
        Add Todo
      </button>
    </>
  );
}

export default TodoInput;
