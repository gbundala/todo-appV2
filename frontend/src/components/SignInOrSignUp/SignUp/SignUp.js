// React imports
import React, { useState } from "react";

// Formik and Yup imports
import { useFormik } from "formik";
import * as Yup from "yup";

// Bootstrap imports
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import FormText from "react-bootstrap/FormText";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";

// Custom Stylesheet
import "./SignUp.css";

// React Router imports
import { useNavigate } from "react-router-dom";

/**
 *
 * SIGN UP COMPONENT
 *
 * This component is mostly a presentational component
 * with some business logic that communicates to the API to enable
 * the user to sign up to the application/platform before they
 * are allowed to do anything on the app. This is basically the
 * first interation space that the user will have with the
 * platform.
 *
 * This component handles the UI for enabling the user to sign up
 * but also triggers the event handler defined here to handle
 * the user signing in. The component calls the fetch method
 * to make a POST request to create the user document. The
 * code for creating the doc in the database is handled in the
 * API server. In this component we just hit the corresponding
 * route that corresponds to this action in the API.
 *
 * USE OF FORMIK LIBRARY:
 * We make use of the formik library inline with suggestion in the
 * React Docs to handle forms and make the process a breeze!
 * Formik enables the coding of complex forms and managing
 * the ephemeral state of the forms much more focused and gives
 * a good Developer Experience.
 *
 * Another library in use is the Yup library that is normally
 * used with Formik to provide with the Validation of user input
 * into the forms.
 *
 * USE OF REACT - ROUTER:
 * The React Router library has also been used here to provide
 * for the routing in the application. In particular the
 * useNavigate hook has been particularly useful in this component
 * to ensure that we navigate to the home page after the user
 * signs up!
 *
 *
 *
 */

export default function SignUp({ setAuthToken }) {
  // Hooks
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Call the useFormik hook
  // Instead of returning the formik object we pluck out
  // the respective props from the object to be used
  // below in the form
  const { handleSubmit, touched, errors, isSubmitting, getFieldProps } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
        repeatPassword: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      validationSchema: Yup.object({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
        repeatPassword: Yup.string().required("Required"),
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
      }),
      onSubmit: (values) => {
        if (values.password !== values.repeatPassword) {
          alert("Confirmed password does not match your password!");
          return;
        }

        // call the event handler
        handleUserSigningIn(values);
      },
    });

  // SignIn Event handler
  function handleUserSigningIn(credentials) {
    fetch("api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        // Save the jwt authToken received from the API into the state (you would need to get the state variable from the App.js as we would pass it down)
        setAuthToken(data);

        // Save the jwt authToken received from the API into
        // localSession
        // Here we use sessionStorage instead of localStorage
        // due to security of the app, to avoid hacks through
        // methods suchs Cross Site Scripting. Refer to the
        // comments in the TodoList component for details on
        // this choice and the reseach made
        sessionStorage.setItem("authToken", JSON.stringify(data));

        // Navigate to the home page
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setError(err);
        console.error("Error in adding new Todo Item: ", err);
      });
  }

  // Inside the form controls we use the getFieldProps method
  // exposed by Formik to reduce boiler place code. Hence
  // replacing onChange, onBlur, value and name props
  // https://formik.org/docs/tutorial#getfieldprops

  return (
    <div className="signup-wrapper">
      <h3>Sign Up</h3>
      <p>Sign up by filling the below details about you!</p>

      {error && (
        <p className="error-note-wrapper">
          Something is wrong in signing up! <br />
          Check your connection & Try again
        </p>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3" controlId="formSignUpUsername">
          <FormLabel>Username</FormLabel>
          <FormControl
            type="text"
            {...getFieldProps("username")}
            placeholder="Enter Username"
          />
          <FormText className="text-danger">
            {errors.username && touched.username && errors.username}
          </FormText>
        </FormGroup>

        <FormGroup className="mb-3" controlId="formSignUpPassword">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            {...getFieldProps("password")}
            placeholder="Password"
          />
          <FormText className="text-danger">
            {errors.password && touched.password && errors.password}
          </FormText>
        </FormGroup>

        <FormGroup className="mb-3" controlId="formBasicRepeatPassword">
          <FormLabel>Repeat Password</FormLabel>
          <FormControl
            type="password"
            {...getFieldProps("repeatPassword")}
            placeholder="Repeat Password"
          />
          <FormText className="text-danger">
            {errors.repeatPassword &&
              touched.repeatPassword &&
              errors.repeatPassword}
          </FormText>
        </FormGroup>

        <FormGroup className="mb-3" controlId="formBasicFirstName">
          <FormLabel>Firstname</FormLabel>
          <FormControl
            type="text"
            {...getFieldProps("firstName")}
            placeholder="Enter Firstname"
          />
          <FormText className="text-danger">
            {errors.firstName && touched.firstName && errors.firstName}
          </FormText>
        </FormGroup>

        <FormGroup className="mb-3" controlId="formBasicLastName">
          <FormLabel>Lastname</FormLabel>
          <FormControl
            type="text"
            {...getFieldProps("lastName")}
            placeholder="Enter Lastname"
          />
          <FormText className="text-danger">
            {errors.lastName && touched.lastName && errors.lastName}
          </FormText>
        </FormGroup>

        <FormGroup className="mb-3" controlId="formBasicEmail">
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type="email"
            {...getFieldProps("email")}
            placeholder="Enter Email"
          />
          <FormText className="text-danger">
            {errors.email && touched.email && errors.email}
          </FormText>
        </FormGroup>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
