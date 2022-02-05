import React from "react";

export default function TodoItem({ todoItem }) {
  return (
    <div>
      <li key={todoItem.id}>{todoItem.name} </li>
    </div>
  );
}
