import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "./Header.css";
import { Link } from "react-router-dom";

/**
 *
 * HEADER:
 *
 * Header component is mainly for presentational purpose
 * to be able to present the options for the user to
 * easily navigate mainly between the Home page where
 * there is the Search Criteria and the Favourites page
 *
 * React Router library is used to enable the navigation
 * The <Link> component from the react-router-dom API
 * has been used here to navigate
 *
 * The remained components are provided by Boostrap
 * with the good visual from the boostrap library
 * as well as good UI
 *
 * On User Signing Out:
 * We remove clear the React state but we also remove the
 * authToken from the sessionStorage and navigate the page
 * back to the sign in page to allow the user to sign in
 * again.
 *
 *
 */
export default function Header({ user, setAuthToken }) {
  return (
    <div className="header-wrapper">
      <Navbar bg="light" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand>
            <Link className="nav-item" to="/">
              TodoList!!
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Item className="welcome-wrapper">
                {user ? `Welcome ${user}!` : ""}
              </Nav.Item>
              <Nav.Item>
                <Link className="nav-item" to="/">
                  {" "}
                  Home
                </Link>
              </Nav.Item>
              <Nav.Item>
                {user ? (
                  <Link
                    className="nav-item"
                    to="/login"
                    onClick={() => {
                      // Remove the token from state
                      setAuthToken("");

                      // Remove the token from session storage
                      sessionStorage.removeItem("authToken");

                      // Navigate back to the login page as per
                      // the "to" attribute above.
                    }}
                  >
                    Log Out
                  </Link>
                ) : (
                  <Link className="nav-item" to="/login">
                    Log In
                  </Link>
                )}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
