import React, {Component} from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

export class AddUserModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    fetchPath = process.env.REACT_APP_API + 'user/AddNewUser';
    connected = true;

    sendQueryToDatabase(user) {
        fetch(this.fetchPath, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name:           user.name.value,
                surname:        user.surname.value,
                dateOfBirth:    user.dateOfBirth.value,
                login:          user.login.value,
                password:       user.password.value
            })
        }, (error) => {
            if(error) {
                this.connected = false;
                alert("Failed!\n" + error);
            }
            else
                this.connected = true;
        });
    }

    handleSubmit(event) {
        
        event.preventDefault();
        if(window.confirm("Are You sure, You want to edit data of this user?"))
            this.sendQueryToDatabase(event.target);
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

        if(this.connected)
            return(
                <div className="container">
                    {this.renderModal()}
                </div>
            );
        else
            return(
                <div>
                    Database failure! Come back later.
                </div>
            );
    }
}
