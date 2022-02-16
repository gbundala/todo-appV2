import React, { useEffect, useState } from "react";
import TodoInput from "../TodoInput/TodoInput";
import TodoItem from "../TodoItem/TodoItem";

export default function TodoList() {
  // State variables for todoList and the fetching states
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUT Request Updated a Document to Create a New Todo Item
  function handleAddTodoItem(newTodoItem) {
    fetch("api/addTodoItem", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodoItem),
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
        // database "UPDATE" operation is complete to ensure the
        // consistency of the data/state between UI and database

        // Hint: We simply just send the content of new todo item
        // that is being added by the signed in user and let the
        // server handle the logic of assigning it an id as well
        // as inserting the item into the documents in the
        // database, this helps in separation of concerns
        // and keeps our frontend code efficient and easily
        // maintainable and it only focuses of doing few things
        // very well and very efficiently.
        const updatedTodoList = [...todoList, data];

        // The setStates below will update after the
        // above has finished running due to the state updates
        // being asynchronous (as noted below in the update
        // request handler)
        setTodoList(updatedTodoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in adding new Todo Item: ", err);
      });
  }

  // TODO: PRESERVE USER TODO IN SESSION - SESSION STORAGE
  useEffect(() => {
    // This variable is useful to determine when to set the
    // todoList state variable. We therefore set the ignore
    // setting state variable to true in the return statement
    // to avoid setting the state process when the component
    // is unmounted from the DOM
    let ignoreSettingState = false;

    // GET Request

    // fetching the data from our Custom API which will
    // manage the fetching of the data from the MongoDB database
    // through the Controllers in the Express App.

    // We then use the endpoints exposed by our restful API
    // in the fetch method below to manage the returned data
    // Further we parse json() on the response since we receive
    // the data in json format from our Custom API
    // then we set the data in the state variable
    fetch("/api")
      .then((res) => res.json())
      .then(
        (data) => {
          if (!ignoreSettingState) setTodoList(data);
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
      // todoList when this component is
      // unmounted from the DOM or when it no longer
      // exists in the DOM tree
      ignoreSettingState = true;
    };
  }, []);

  return (
    <div>
      <TodoInput handleAddTodoItem={handleAddTodoItem} />

      <div className="todo-list-wrapper">
        {todoList &&
          todoList.map((todoItem) => {
            return <TodoItem key={todoItem.id} todoItem={todoItem} />;
          })}
      </div>
    </div>
  );
}
