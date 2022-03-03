// react imports
import { useState } from "react";

// React router
import { Route, Routes } from "react-router-dom";

// Stylesheet
import "./App.css";

// React-bootstrap
import Header from "./components/Header/Header";

// Child Components import
import TodoList from "./components/TodoList/TodoList";
import SignInOrSignUp from "./components/SignInOrSignUp/SignInOrSignUp";

// Inside the return we call the <link> tag at the top
// level with bootstrap links to ensure the entire app
// is served with the boostrap styles

// We use the optional chaining (?.) operator in the
// Header component when passing the user to avoid
// errors when the user has not yet logged in,
// hence it just returns undefined.
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
// Reference2: https://www.freecodecamp.org/news/how-the-question-mark-works-in-javascript/

// React Router has been used to provide routing in the frontend
// application. More details on this in the child components
// documentation and comments
function App() {
  // Define authToken state variable
  const [authToken, setAuthToken] = useState("");

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />

      <Header user={authToken.user?.firstName} setAuthToken={setAuthToken} />
      <Routes>
        <Route
          path="/"
          element={
            <TodoList authToken={authToken} setAuthToken={setAuthToken} />
          }
        />
        <Route
          path="/login"
          element={
            <SignInOrSignUp authToken={authToken} setAuthToken={setAuthToken} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
