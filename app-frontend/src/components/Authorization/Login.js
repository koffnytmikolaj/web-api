import React, {useRef, useState} from "react";
import { Button, Row, Col, Form, FloatingLabel, Container, Overlay } from "react-bootstrap";
import { Redirect } from "react-router-dom";

function Login(props) {

    const [errorMessage, setErrorMessage] = useState("");

    const [showOverlay, setShowOverlay] = useState(false);
    const target = useRef(null);

    const fetchPath = process.env.REACT_APP_API + 'login';

    function findErrors(result) {

        if(result)
            window.location.reload();
        else {
            setErrorMessage("Wrong password or login!");
            setShowOverlay(true);
        }
            
    }
    
    function tryLogIn(user) {
        (
            async () => {
                await fetch(fetchPath, {
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
                }).then(res => res.json()).then(result => {
                    findErrors(result);
                });
            }
        )();
    }
    
    function handleSubmit(event) {
        
        event.preventDefault();
        tryLogIn(event.target);
    }


    function renderOverlay() {

        return (
            <Overlay target={target.current} show={showOverlay} placement="right">
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
                    {errorMessage}
                </div>
                )}
            </Overlay>
        );
    }

    function renderSubmitButton() {

        return (
                <Button 
                    variant="primary" 
                    className="btn btn-lg btn-primary btn-block" 
                    type="submit"
                    ref={target}
                >
                    Sign in
                </Button>
        );
    }

    function renderForm() {

        return(
            
            <Form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <Form.Group controlId="login">
                    <FloatingLabel label="Login" className="sr-only">
                        <Form.Control type="text" name="login" className="form-control" required placeholder="Login"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="password">
                    <FloatingLabel label="Password" className="sr-only">
                        <Form.Control type="password" name="password" className="form-control" required placeholder="Password"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <div className="mt-3"></div>
                <Form.Group>
                    {renderSubmitButton()}
                    {renderOverlay()}
                </Form.Group>
                <p className="mt-5 mb-3 text-muted">© 2021-2022</p>
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
export default Login;