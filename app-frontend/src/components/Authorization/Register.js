import React, { useRef, useState } from "react";
import { Container, Button, Row, Col, Form, FloatingLabel, Overlay } from "react-bootstrap";
import { Redirect } from "react-router-dom";

function Register(props) {

    const [errorObjects, setErrorObjects] = useState([]);

    const nameTarget = useRef(null);
    const surnameTarget = useRef(null);
    const dateTarget = useRef(null);
    const loginTarget = useRef(null);
    const passwordTarget = useRef(null);
    const passwordRepeatTarget = useRef(null);

    const registerPath = process.env.REACT_APP_API + 'user/AddNewUser';
    const loginPath = process.env.REACT_APP_API + 'login';

    
    function logIn(user) {
        (
            async () => {
                await fetch(loginPath, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        Login:         user.login.value,
                        Password:      user.password.value,
                    })
                }, (error) => {
                    if(error)
                        alert("Failed!\n" + error);
                }).then(() => window.location.reload());
            }
        )();
        
    }

    function setErrorObject(result, user) {

        if(result === 1)
            logIn(user)
        setErrorObjects(result);
    }

    function tryRegister(user) {
        (
            async () => {
                await fetch(registerPath, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Name:           user.name.value,
                        Surname:        user.surname.value,
                        DateOfBirth:    user.dateOfBirth.value,
                        Login:          user.login.value,
                        Password:       user.password.value,
                        PasswordRepeat: user.passwordRepeat.value
                    })
                }, (error) => {
                    if(error)
                        alert("Failed!\n" + error);
                }).then(res => res.json()).then(result => {
                    setErrorObject(result, user);
                });
            }
        )();
    }

    function handleSubmit(event) {
        
        event.preventDefault();
        tryRegister(event.target);
    }

    function checkError(errorObject) {
        
        return errorObject !== undefined && errorObject !== "";
    }


    function renderOverlay(errorKey, target) {

        let errorObject = errorObjects[errorKey];
        if(checkError(errorObject)) {
            return(
                <Overlay target={target.current} placement="right" show={true}>
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div
                        {...props}
                        style={{
                        backgroundColor: 'rgba(255, 100, 100, 0.85)',
                        padding: '2px 10px',
                        color: 'white',
                        borderRadius: 3,
                        ...props.style,
                        }}
                    >
                        {errorObject}
                    </div>
                    )}
                </Overlay>
            );
        }
    }
    
    function renderAddUserButton() {

        return(
            <Button variant="primary" type="submit">
                Submit
            </Button>
        );
    }
    
    function renderForm() {

        return(
            <Form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please register</h1>
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="First Name" ref={nameTarget}>
                            <Form.Control type="text" name="name" required placeholder="First Name"></Form.Control>
                        </FloatingLabel>
                        {renderOverlay("name", nameTarget)}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="surname">
                        <FloatingLabel label="Family Name" ref={surnameTarget}>
                            <Form.Control type="text" name="surname" required placeholder="Family Name"></Form.Control>
                        </FloatingLabel>
                        {renderOverlay("surname", surnameTarget)}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="dateOfBirth">
                        <FloatingLabel label="Date of birth" ref={dateTarget}>
                            <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth"></Form.Control>
                        </FloatingLabel>
                        {renderOverlay("date", dateTarget)}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="login">
                        <FloatingLabel label="Login" ref={loginTarget}>
                            <Form.Control type="text" name="login" required placeholder="Login"></Form.Control>
                        </FloatingLabel>
                        {renderOverlay("login", loginTarget)}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="password">
                        <FloatingLabel label="Password" ref={passwordTarget}>
                            <Form.Control type="password" name="password" required placeholder="Password"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    {renderOverlay("password", passwordTarget)}
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="passwordRepeat">
                        <FloatingLabel label="Repeat password" ref={passwordRepeatTarget}>
                            <Form.Control type="password" name="passwordRepeat" required placeholder="Repeat Password"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    {renderOverlay("passwordRepeat", passwordRepeatTarget)}
                </Row>
                <br/>
                <Form.Group>
                    {renderAddUserButton()}
                </Form.Group>
            </Form>
        );
    }

    function main() {

        if(props.logged_user !== 0)
            return(
                <Redirect to="/"></Redirect>
            );
        else
            return(
                <Container className="text-center mt-5">
                    <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            {renderForm()}
                        </Col>
                    </Row>
                </Container>
            );
    }

    return main();
}
export default Register;