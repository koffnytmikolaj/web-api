import React, {Component} from "react";
import { Container, Button, Row, Col, Form, FloatingLabel, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";

export class Register extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            errorObjects: []
        }
    }
    
    registerPath = process.env.REACT_APP_API + 'user/AddNewUser';
    loginPath = process.env.REACT_APP_API + 'login';

    
    async logIn(user) {

        await fetch(this.loginPath, {
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

    setErrorObject(result, user) {

        if(result === 1)
            this.logIn(user)
        this.setState({errorObjects: result});
    }

    async tryRegister(user) {

        await fetch(this.registerPath, {
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
            this.setErrorObject(result, user);
        });
    }

    handleSubmit(event) {
        
        event.preventDefault();
        this.tryRegister(event.target);
    }

    checkError(errorObject) {
        
        return errorObject !== undefined && errorObject !== "";
    }


    renderAlert(errorKey) {

        let errorObject = this.state.errorObjects[errorKey];
        if(this.checkError(errorObject)) {
            return(
                <Alert variant="danger">{errorObject}</Alert>
            );
        }
    }
    
    renderAddUserButton() {

        return(
            <Button variant="primary" type="submit">
                Submit
            </Button>
        );
    }
    
    renderForm() {

        return(
            <Form onSubmit={this.handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please register</h1>
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="First Name">
                            <Form.Control type="text" name="name" required placeholder="First Name"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("name")}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="surname">
                        <FloatingLabel label="Family Name">
                            <Form.Control type="text" name="surname" required placeholder="Family Name"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("surname")}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="dateOfBirth">
                        <FloatingLabel label="Date of birth">
                            <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("date")}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="login">
                        <FloatingLabel label="Login">
                            <Form.Control type="text" name="login" required placeholder="Login"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("login")}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="password">
                        <FloatingLabel label="Password">
                            <Form.Control type="password" name="password" required placeholder="Password"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("password")}
                    </Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="passwordRepeat">
                        <FloatingLabel label="Repeat password">
                            <Form.Control type="password" name="passwordRepeat" required placeholder="Repeat Password"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("passwordRepeat")}
                    </Form.Group>
                </Row>
                <br/>
                <Form.Group>
                    {this.renderAddUserButton()}
                </Form.Group>
            </Form>
        );
    }

    render() {

        if(this.props.logged_user !== 0)
            return(
                <Redirect to="/"></Redirect>
            );
        else
            return(
                <Container className="text-center mt-5">
                    <Row>
                        <Col >
                            {this.renderForm()}
                        </Col>
                    </Row>
                </Container>
            );
    }
}
