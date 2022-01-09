import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

export class TopNavigation extends Component {

    constructor(props) {

        super(props);
        this.state = {
            connected: true
        }
    }

    logOutPath = process.env.REACT_APP_API + 'login/logout';

    async logOut() {

        await fetch(this.logOutPath, {
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


    renderAuthorizationButtons() {

        let authorized = this.props.logged_user;
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
                <Button variant="danger" onClick={()=> this.logOut()}>Log out</Button>
            </Nav>
        );
    }

    render() {

        return(
            <Navbar variant="dark" bg="dark" expand="lg">
                <Navbar.Brand href="/" className="px-2">My App</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    {this.renderAuthorizationButtons()}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}