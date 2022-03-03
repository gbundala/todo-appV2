// React imports
import React, { useState } from "react";

// Formik and Yup imports
import { useFormik } from "formik";
import * as Yup from "yup";

// Import stylesheet
import "./SignIn.css";

// Bootstrap imports
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import FormText from "react-bootstrap/FormText";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";

// React Router imports
import { useNavigate } from "react-router-dom";

/**
 *
 * SIGN IN COMPONENT
 *
 * This component is similar to the SIGN UP component and
 * hence most of the documentation / comments are the same.
 * Reference therefore should be made there to get the
 * the structure and the design for the code here.
 *
 * Also use of Formik, Yup and the React Router library has been
 * used here as well like in the sign up component
 *
 */

export default function SignIn({ authToken, setAuthToken }) {
  // Hooks and State variables
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Call the useFormik hook
  // Instead of returning the formik object we pluck out
  // the respective props from the object to be used
  // below in the form
  const { handleSubmit, handleBlur, handleChange, values, touched, errors } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: Yup.object({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
      }),
      onSubmit: (values) => {
        // call the event handler with the values
        handleUserSigningIn(values);
      },
    });

  // SignIn Event handler
  function handleUserSigningIn(credentials) {
    fetch("api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // If the server returns an error then we just
          // alert it to the user for the user to retry again
          alert(data.message);
        } else {
          // Save the jwt authToken received from the API into the state (you would need to get the state variable from the App.js as we would pass it down)
          setAuthToken(data);

          // Save the jwt authToken received from the API into
          // localSession
          // Here we use sessionStorage instead of localStorage
          // due to security of the app. Refer to the
          // comments in the TodoList component for details
          sessionStorage.setItem("authToken", JSON.stringify(data));

          // Navigate to the home page
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setError(err);
        console.error("Error in logging in the Application: ", err);

        alert(
          "Error in logging in, please check your internet connection and try again!"
        );

        // Navigate to login Page again if there is an error
        navigate("/login", { replace: true });
      });
  }

  return (
    <div className="sign-in-wrapper">
      <h3>Please signin with your username and password</h3>

      <p>
        If you don't have the credentials, you may sign up in the adjacent form
      </p>

      {error && (
        <p className="error-note-wrapper">
          Something is wrong in signing in! <br />
          Check your connection & Try again
        </p>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3" controlId="formBasicUsername">
          <FormLabel>Username</FormLabel>
          <FormControl
            type="text"
            name="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
            placeholder="Enter Username"
          />
          <FormText className="text-danger">
            {errors.username && touched.username && errors.username}
          </FormText>
        </FormGroup>

        <FormGroup className="mb-3" controlId="formBasicPassword">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            values={values.password}
            placeholder="Password"
          />
          <FormText className="text-danger">
            {errors.password && touched.password && errors.password}
          </FormText>
        </FormGroup>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
