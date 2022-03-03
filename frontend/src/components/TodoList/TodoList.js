// React imports
import React, { useEffect, useState } from "react";

// React-bootstrap imports
import TodoInput from "../TodoInput/TodoInput";
import TodoItem from "../TodoItem/TodoItem";
import ListGroup from "react-bootstrap/ListGroup";

// React Router imports
import { useNavigate } from "react-router-dom";

// Stylesheet import
import "./TodoList.css";

/**
 *
 * TODOLIST COMPONENT
 *
 * This component is the main component that handles most
 * of the business logic for the frontend part of this
 * application
 *
 * This component handles all the calls to the backend for
 * all user actions including adding a todo, deleting it or
 * updating it. The fetch method is used to make the calls
 * with the respective options for PUT or GET method.
 *
 * Based on the design of the database, any action made is
 * meant to either create a new user document or just edit
 * the user document which contains the TodoList. Hence why
 * the GET and PUT methods are the ones that are mostly
 * used here.
 *
 * The state for the authToken which determines the identity of
 * the user that has signed in is lifted up to the App component
 * in order to ensure accessibility of it to both this
 * state as well as the Header.
 *
 * In the event of mounting of this component we check first
 * whether the user object is in the state, if not we then
 * check in the session Storage and if it still does not exist
 * we then navigate the page back to the login page. This is
 * also done whenever the server sends back a error relating
 * to the authentication of the user.
 *
 * If any of the two initial conditional checks succeed (i.e
 * the user is in either the state or is in the session storage
 * and is not yet expired) then the fetch call is made to fetch
 * the todos or refresh the token (with a new expiry date), in
 * either instance the user is able to see their todo. This
 * security feature is enabled by JWT tokens which ensures
 * only an authenticated user can see their todos and make
 * any actions.
 *
 * To ensure that only an authenticated user is able to make
 * any sort of action, each fetch call to a protected action (
 * including getting todos, updating todos, adding them or even
 * deleting them) is accomponies by the "Authorization" header
 * in the fetch call which includes the auth token that has
 * been generated when user has logged in into the application
 * by the authentication end-point in the backend.
 *
 * HANDLING OF PASSWORDS: An additional security feature has been
 * made to the passwords by using bcypt library to hash the
 * passwords in the backend before storing them on the server.
 * In addition, the user document sent from server does
 * not include even the hashed passwords. These are deleted
 * before sending a "clean" user Object from the server to
 * the frontend.
 *
 * RESEARCH MADE: Inline with best practices for security using
 * jwt token, the sessionStorage has been used (with an
 * additional security feature of expiring the token) instead
 * of localStorage. The resource linked below suggests that
 * "Use the object sessionStorage instead of localStorage if
 * persistent storage is not needed. sessionStorage object is
 * available only to that window/tab until the window is closed."
 * This is useful to avoid security vulnerabilities such as
 * Cross Site Scripting.
 * Link: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage
 *
 * Other details on the use and structure of JWT tokens can
 * be found on the jwt.io website introductory page.
 * See link: https://jwt.io/introduction
 *
 *
 */

export default function TodoList({ authToken, setAuthToken }) {
  // State variables for todoList and the fetching states
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // React router hooks
  const navigate = useNavigate();

  // PUT Request to Update a Document to Create a New Todo Item
  function handleAddTodoItem(newTodoItem) {
    fetch("api/addTodoItem", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: authToken.user?._id,
        todoItem: newTodoItem,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // We alert to the user the error when the system
          // fails to add a new todo
          alert(data.message);
        } else {
          // Inline with to the best practices
          // we have ensured that we only update the added
          // Object that is returned from the database after the
          // database "PUT" operation is complete to ensure the
          // consistency of the data/state between UI and database

          // We simply just send the content of new todo item
          // that is being added by the signed in user and let the
          // server handle the logic of assigning it an id as well
          // as inserting the item into the documents in the
          // database, this helps in separation of concerns
          // and keeps our frontend code efficient and easily
          // maintainable as it only focuses of doing few things
          // very well and very efficiently.

          // The setStates below will update after the
          // above has finished running due to the state updates
          // being asynchronous (as noted below in the update
          // request handler)

          setTodoList(data.todoList);

          // We also clear any loading state and error state that
          // may have been stored in the respective states
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in adding new Todo Item: ", err);
      });
  }

  // PUT Request to Update a Document after deleting an item
  function handleDeleteTodoItem(todoId) {
    fetch("api/deleteTodoItem", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: authToken.user._id,
        todoId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Similar to the documentation above  in the 'add todo'
        // handler we set the returned data from the server.
        // We let the server handle all the logic of removing
        // the items from that has been deleted from the list
        // and the servers returns here to the frontend the
        // newly updated list after deleting the removed item.

        // This helps in keeping the frontend focused on what
        // it does best in updating the UX and presentational
        // aspects. Hence a better separation of concerns and
        // keeping the frontend more efficient

        setTodoList(data.todoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in Deleting Todo Item: ", err);
      });
  }

  function handleEditTodoItem(todoId, updatedTodoItem) {
    fetch("api/editTodoItem", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: authToken.user._id,
        todoId,
        updatedTodoItem,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Similar to above, we let the backend handle all the
        // logic and return to use an updated list.

        // CONSISTENT DATA: In addition
        // to the above points on efficiency and focused
        // separation of concerns we ensure that there is
        // consistency in the data between the frontend
        // and the database/backend

        setTodoList(data.todoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in Editing Todo Item: ", err);
      });
  }

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
      // GET Request

      // fetching the data from our Custom API which will
      // manage the fetching of the data from the MongoDB database
      // through the Controllers in the Express App.

      // We then use the endpoints exposed by our restful API
      // in the fetch method below to manage the returned data
      // Further we parse json() on the response since we receive
      // the data in json format from our Custom API
      // then we set the data in the state variable

      fetch(`/api/getTodos/${authToken.user?._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      })
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
            console.error("Error in fetching data to Get Todos: ", err);
          }
        );
    } else if (sessionAuthToken) {
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
            if (!ignoreSettingState) setAuthToken(data);
            setLoading(false);
            setError(null);
          },
          (err) => {
            setError(err);
            setLoading(false);
            console.error(
              "Error in fetching data to Refresh Auth Token: ",
              err
            );

            alert(
              "There is an Error in your Authentication, please login again."
            );

            // Navigate to login Page again if there is an error
            // here as the user would not be recognized in the
            // current instance of the application meaning the
            // user is not in state (the authToken is not being
            // set in state due to this Error here). Hence the
            // fall back here is for the user to re-authenticate
            // to ensure security of the App
            navigate("/login", { replace: true });
          }
        );
    } else {
      // Alert to the user to login before they can use the App
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

      {loading && <p>Loading...</p>}

      {error && (
        <p className="error-note-wrapper">
          Something is wrong! <br />
          Check your connection & Refresh Page
        </p>
      )}

      {!todoList.length && (
        <p className="empty-array-note">
          Add Your Todos above to see them here!
        </p>
      )}

      <ListGroup className="todo-list-wrapper">
        {todoList &&
          todoList.map((todoItem) => {
            return (
              <TodoItem
                key={todoItem.todoId}
                todo={todoItem}
                handleDeleteTodoItem={handleDeleteTodoItem}
                handleEditTodoItem={handleEditTodoItem}
              />
            );
          })}
      </ListGroup>
    </div>
  );
}
