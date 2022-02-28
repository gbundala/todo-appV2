import React, { useEffect, useState } from "react";
import TodoInput from "../TodoInput/TodoInput";
import TodoItem from "../TodoItem/TodoItem";

// React Router imports
import { useNavigate } from "react-router-dom";

export default function TodoList({ authToken, setAuthToken }) {
  // State variables for todoList and the fetching states
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("Do we have value in State:", authToken);
  // React router hooks
  const navigate = useNavigate();

  // PUT Request Updated a Document to Create a New Todo Item
  function handleAddTodoItem(newTodoItem) {
    console.log("NEW TODO", newTodoItem);
    fetch("api/addTodoItem", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: authToken.user._id,
        todoItem: newTodoItem,
      }),
    })
      .then((res) => {
        console.log("response", res);
        return res.json();
      })
      .then((data) => {
        // FIXME: DELETE CONSOLE LOG
        console.log("DATA FROM ADDING TODO", data);
        // We create a new array that will contain the existing
        // items as well as the newly added item into the database
        // We use the spread '...' syntax to achieve this

        // This is inline with React best practices as noted
        // below in ensuring we don't mutate state
        // Reference: https://beta.reactjs.org/learn/updating-arrays-in-state#adding-to-an-array

        // In addition to the best practice of not mutating state
        // we have also ensured that we only update the added
        // Object that is returned from the database after the
        // database "PUT" operation is complete to ensure the
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
        setTodoList(data.todoList);
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

    // Get the authToken from session storage
    const sessionAuthToken = JSON.parse(sessionStorage.getItem("authToken"));

    if (authToken) {
      // FIXME: DELETE LOG
      console.log("STATE VARIABLE AUTHTOKEN IS CALLED UNDER FIRST IF");
      // GET Request

      // fetching the data from our Custom API which will
      // manage the fetching of the data from the MongoDB database
      // through the Controllers in the Express App.

      // We then use the endpoints exposed by our restful API
      // in the fetch method below to manage the returned data
      // Further we parse json() on the response since we receive
      // the data in json format from our Custom API
      // then we set the data in the state variable

      fetch(`/api/getTodos/${authToken.user._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      })
        .then((res) => res.json())
        .then(
          (data) => {
            // FIXME: DELETE LOG
            console.log("DATA FROM GET TODOS CALL", data);
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
    } else if (sessionAuthToken) {
      // FIXME: DELETE LOG
      console.log("SESSIONS ELSE IS CALLED");
      // GET Request
      fetch("/api/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionAuthToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionAuthToken),
      })
        .then((res) => res.json())
        .then(
          (data) => {
            // FIXME: DELETE LOG
            console.log("DATA FROM REFRESH CALL", data);
            if (!ignoreSettingState) setAuthToken(data);
            setLoading(false);
            setError(null);
          },
          (err) => {
            setError(err);
            setLoading(false);
            console.error("Error in fetching data: ", err);
          }
        );
    } else {
      // FIXME: DELETE LOG
      console.log("LAST ELSE IS CALLED");
      alert("Please signin or signup before using the TodoList App!");

      // Navigate to the Login page
      navigate("/login", { replace: true });
    }

    // Clean Up
    return () => {
      // we set the ignorSettingState variable to true
      // in order to avoid setting the state variable
      // todoList when this component is
      // unmounted from the DOM or when it no longer
      // exists in the DOM tree
      ignoreSettingState = true;
    };
  }, [authToken, setAuthToken, navigate]);

  return (
    <div>
      <TodoInput handleAddTodoItem={handleAddTodoItem} />

      <div className="todo-list-wrapper">
        {todoList &&
          todoList.map((todoItem) => {
            return <TodoItem key={todoItem.todoId} todoItem={todoItem} />;
          })}
      </div>
    </div>
  );
}
