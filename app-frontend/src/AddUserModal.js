import React, {Component} from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

export class AddUserModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    
    handleSubmit(event) {
        event.preventDefault();
        fetch(process.env.REACT_APP_API + 'user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: event.target.name.value,
                surname: event.target.surname.value,
                dateOfBirth: event.target.dateOfBirth.value,
                login: event.target.login.value,
                password: event.target.password.value
            })
        }).then(res => res.json()).then(result => {
            alert(result);
        }, (error) => {
            alert("Failed!\n" + error);
        });
    }


    renderAddUserButton() {

        return(
            <Button variant="primary" type="submit">
                Add User
            </Button>
        );
    }
    
    renderForm() {
        return(
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="name" required placeholder="First Name"></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="surname">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control type="text" name="surname" required placeholder="Family Name"></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="dateOfBirth">
                    <Form.Label>Date Of Birth</Form.Label>
                    <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth"></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="login">
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="text" name="login" required placeholder="Login"></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" required placeholder="Password"></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="passwordRepeat">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control type="password" name="passwordRepeat" required placeholder="Repeat Password"></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group>
                    {this.renderAddUserButton()}
                </Form.Group>
            </Form>
        );
    }
    
    renderModalBody() {
        return(
            <Row>
                <Col sm={6}>
                    {this.renderForm()}
                </Col>
            </Row>
        );
        
    }

    renderHideButton() {

        return(
            <Button variant="danger" onClick={this.props.onHide}>
                Close
            </Button>
        );
    }

    renderModal() {

        return(
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
                
                <Modal.Footer>
                    {this.renderHideButton()}
                </Modal.Footer>
            </Modal>
        );
    }

    render() {

        return(
            <div className="container">
                {this.renderModal()}
            </div>
        );
    }
}
