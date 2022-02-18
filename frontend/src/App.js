// Stylesheet
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import SignInOrSignUp from "./components/SignInOrSignUp/SignInOrSignUp";

// Component import
import TodoList from "./components/TodoList/TodoList";

// Inside the return we call the <link> tag at the top
// level with bootstrap links to ensure the entire app
// is served with the boostrap styles
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

      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <TodoList authToken={authToken} setAuthToken={setAuthToken} />
          }
        />
        <Route
          path="/signup"
          element={
            <SignInOrSignUp authToken={authToken} setAuthToken={setAuthToken} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
