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

// React Router imports
import { useNavigate } from "react-router-dom";

export default function SignIn({ authToken, setAuthToken }) {
  // Hooks
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Call the useFormik hook
  // Instead of returning the formik object we pluck out
  // the respective props from the object to be used
  // below in the form
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      // FIXME: DELETE CONSOLE LOG
      console.log(values);
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

  return (
    <div>
      <h3>Please signin with your username and password</h3>

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

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </Form>

      {/* TODO: SEE HOW TO IMPLMENT SHOWING ERROR */}
      {/* <h3>{error && error}</h3> */}
    </div>
  );
}
