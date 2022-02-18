import React from "react";
import "./SignInOrSignUp.css";

// Child components
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

export default function SignInOrSignUp({ authToken, setAuthToken }) {
  return (
    <div className="signin-and-signup-wrapper">
      <SignIn authToken={authToken} setAuthToken={setAuthToken} />
      <SignUp authToken={authToken} setAuthToken={setAuthToken} />
    </div>
  );
}
