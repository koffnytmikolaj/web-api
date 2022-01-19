import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

function BottomNavigation(props) {

    function renderNavLinksForEveryone() {

        return (
            <>
                <NavLink className="d-inline p-2 bg-dark text-white" to="/">
                    <Button variant="outline-light">Home</Button>
                </NavLink>
            </>
        )
    }

    function renderNavLinksForAuthorized() {

        let authorized = props.logged_user;
        if(authorized !== -1 && authorized !== 0) {
            return (
                <>
                    <NavLink className="d-inline p-2 bg-dark text-white" to="/user">
                        <Button variant="outline-light">Users</Button>
                    </NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white" to="/company">
                        <Button variant="outline-light">Companies</Button>
                    </NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white" to="/trade_notes">
                        <Button variant="outline-light">Trade Notes</Button>
                    </NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white" to="/contact_people">
                        <Button variant="outline-light">Contact People</Button>
                    </NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white" to="/industry">
                        <Button variant="outline-light">Industries</Button>
                    </NavLink>
                </>
            );
        }

        
    }

    function main() {

        return(

            <Navbar bg="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        {renderNavLinksForEveryone()}
                        {renderNavLinksForAuthorized()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    return main();
}
export default BottomNavigation;