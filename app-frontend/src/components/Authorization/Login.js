import React, {Component} from "react";
import { Button, Row, Col, Form, FloatingLabel, Container } from "react-bootstrap";
import { Redirect } from "react-router-dom";

export class Login extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            errorMessage: ""
        }
    }

    fetchPath = process.env.REACT_APP_API + 'login';

    findErrors(result) {

        if(result)
            window.location.reload();
        else
            this.setState({errorMessage: result});
    }
    
    async tryLogIn(user) {

        await fetch(this.fetchPath, {
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
            this.findErrors(result);
        });
    }
    
    handleSubmit(event) {
        
        event.preventDefault();
        this.tryLogIn(event.target);
    }


    renderForm() {

        return(
            
            <Form onSubmit={this.handleSubmit}>
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
                    <Button variant="primary" className="btn btn-lg btn-primary btn-block" type="submit">
                        Sign in
                    </Button>
                </Form.Group>
                <p className="mt-5 mb-3 text-muted">© 2021-2022 {this.state.message}</p>
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
                        <Col md={{ span: 4, offset: 4 }}>
                            {this.renderForm()}
                        </Col>
                    </Row>
                </Container>
            );
    }
}
