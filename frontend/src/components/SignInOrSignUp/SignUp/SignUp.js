// React imports
import React, { useState } from "react";

// Formik and Yup imports
import { useFormik } from "formik";
import * as Yup from "yup";

// Bootstrap imports
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import FormText from "react-bootstrap/FormText";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";

// Custom Stylesheet
import "./SignUp.css";

// React Router imports
import { useNavigate } from "react-router-dom";

export default function SignUp({ authToken, setAuthToken }) {
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

        // FIXME: DELETE LOG
        console.log(values);
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
        // FIXME: DELETE console
        console.log("authToken", data);
        // Save the jwt authToken received from the API into the state (you would need to get the state variable from the App.js as we would pass it down)
        setAuthToken(data);

        // Save the jwt authToken received from the API into localSession
        // TODO: Put here the comment about seesionstorage being advised instead of localStorate. attach the link to the refererence as well
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

      {/* TODO: SEE HOW TO IMPLMENT SHOWING ERROR */}
      {/* <h3>{error && error}</h3> */}
    </div>
  );
}
