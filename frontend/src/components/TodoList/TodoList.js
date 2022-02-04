import React from "react";

/** We have encapsulated the rendering of the list logic here where we receive the respective props for the todoList array and the handleRemove method */
function TodoList({ todoList, handleRemove }) {
  return <ul>hellow</ul>;
}

export default TodoList;

// {todoList.map((todoItem) => {
//     return (
//       <li key={todoItem.id}>
//         {todoItem.name}{" "}
//         <button onClick={() => handleRemove(todoItem)}>Remove</button>
//       </li>
//     );
//   })}
