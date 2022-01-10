import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

function BottomNavigation() {

    function main() {

        return(

            <Navbar bg="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavLink className="d-inline p-2 bg-dark text-white" to="/">
                            <Button variant="outline-light">Home</Button>
                        </NavLink>
                        <NavLink className="d-inline p-2 bg-dark text-white" to="/user">
                            <Button variant="outline-light">Users</Button>
                        </NavLink>
                        <NavLink className="d-inline p-2 bg-dark text-white" to="/industries">
                            <Button variant="outline-light">Industries</Button>
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    return main();
}
export default BottomNavigation;