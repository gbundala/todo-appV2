import React from "react";
import Button from "react-bootstrap/esm/Button";

// FIXME: Completely revisit here and add features
// why do we need to have keys here and in the parent meaning the todoItem.todoId
export default function TodoItem({ todoItem }) {
  return (
    <div>
      <li key={todoItem.todoId}>{todoItem.todoItem}</li>
      <Button>&#10005;</Button>
      <Button>&#9998;</Button>
    </div>
  );
}
