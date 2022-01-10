import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

function TopNavigation(props) {

    const logOutPath = process.env.REACT_APP_API + 'login/logout';

    function logOut() {

        (async () => {
            await fetch(logOutPath, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(result => {
                if(result.ok) {
                    window.location.reload();
                }
            });
        }
        )();
    }


    function renderAuthorizationButtons() {

        let authorized = props.logged_user;
        if(authorized === 0 || authorized === -1)
            return (
                <Nav className="justify-content-end" style={{ width: "100%" }}>
                    <NavLink to="/login" className="px-2">
                        <Button variant="outline-primary">Sign in</Button>
                    </NavLink>
                    <NavLink to="/register" className="px-2">
                        <Button variant="primary">Sign up</Button>
                    </NavLink>
                </Nav>
            );
            else
        return (
            <Nav className="justify-content-end px-2" style={{ width: "100%" }}>
                <Button variant="danger" onClick={logOut}>Log out</Button>
            </Nav>
        );
    }

    function main() {

        return(
            <Navbar variant="dark" bg="dark" expand="lg">
                <Navbar.Brand href="/" className="px-2">My App</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    {renderAuthorizationButtons()}
                </Navbar.Collapse>
            </Navbar>
        );
    }

    return main();
}
export default TopNavigation;