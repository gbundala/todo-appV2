// React imports
import React from "react";

// Import Stylesheet
import "./SignInOrSignUp.css";

// Child components
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

/**
 *
 * SIGN IN OR SIGN UP COMPONENT
 *
 *  This component is basically a presentational/ UI component
 * to provide for the interface of the user for both signing in
 *  and signing up. The children of this component handle all
 * the business logic for the respective action of the user, i.e.
 * whether the user has signed up or signed in.
 *
 * This structure has been relevant in order not to have many
 * routes being rendered by React Router from the main App.js
 * component. It also provides for a good UX as both the signin
 * and signup are close on the page hence the user can easily
 * select the option they want to go for at the moment!
 *
 * The authToken and the respective set state function are passed
 * here from the App.js component to be used in the respective
 * signup and signin business logics and handling of the
 * respective events for the user signing in and getting the
 * jwt auth Token from the server.
 *
 */

export default function SignInOrSignUp({ authToken, setAuthToken }) {
  return (
    <div className="signin-and-signup-wrapper">
      <SignIn authToken={authToken} setAuthToken={setAuthToken} />
      <SignUp setAuthToken={setAuthToken} />
    </div>
  );
}
