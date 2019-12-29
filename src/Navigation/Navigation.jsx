import React from 'react';
import './Navigation.css';
//import Link from '../shared/Link/Link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const Navigation = ({ isLogged }) => {
        return (
            // <Navbar bg="info" variant="dark">
            <Navbar bg="navbar">
                <Navbar.Brand href="/">
                    <img
                        src="/travel-logo.svg"
                        width="30"
                        height="40"
                        className="d-inline-block align-middle"
                        alt="Travel logo"
                    />
                </Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link className="mr-2" href="/home">Home</Nav.Link>
                    <Nav.Link className="mr-2" href="/hotels/all">Browse hotels</Nav.Link>
                    <Nav.Link className="mr-2" href="/comments/latest">Latest comments</Nav.Link>
                    <Nav.Link className="mr-2" href="/rankings">Rankings</Nav.Link>
                </Nav>
                <Nav className="ml-auto mr-4">
                    <Nav.Link className="mr-2" href="/login">Login</Nav.Link>
                    <Nav.Link className="mr-2" href="/register">Register</Nav.Link>
                </Nav>
                <Form inline>
                    <FormControl size="lg" type="text" placeholder="Search for a hotel" className="mr-sm-2" />
                    <Button variant="outline-light" size="lg">Search</Button>
                </Form>
            </Navbar>
        )
};

export default Navigation;
