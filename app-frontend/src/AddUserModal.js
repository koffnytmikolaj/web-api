import React, {Component} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel, Alert } from "react-bootstrap";

export class AddUserModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            errorObjects: []
        }
    }
    
    fetchPath = process.env.REACT_APP_API + 'user/AddNewUser';
    errorObjectSet = false;
    
    setErrorObject(result) {

        this.setState({errorObjects: result});
        console.log("result " + this.state.errorObjects);
    }
    
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
                password:       user.password.value,
                passwordRepeat: user.passwordRepeat.value
            })
        }, (error) => {
            if(error)
                alert("Failed!\n" + error);
        }).then(res => res.json()).then(result => {
            this.setErrorObject(result);
        });
    }

    handleSubmit(event) {
        
        event.preventDefault();
        if(window.confirm("Are You sure, You want to add this user?"))
            this.sendQueryToDatabase(event.target);
    }

    checkError(errorObject) {
        
        return errorObject !== undefined && errorObject.Correct !== undefined && !errorObject.Correct;
    }


    renderAlert(errorIndex) {

        let errorObject = this.state.errorObjects[errorIndex];
        if(this.checkError(errorObject)) {
            return(
                <Alert variant="danger">{errorObject.Value}</Alert>
            );
        }
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
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="First Name">
                            <Form.Control type="text" name="name" required placeholder="First Name"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert(0)}
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
                        {this.renderAlert(1)}
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
                        {this.renderAlert(2)}
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
                        {this.renderAlert(3)}
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
                        {this.renderAlert(4)}
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
                        {this.renderAlert(5)}
                    </Form.Group>
                </Row>
                <br/>
                <Form.Group>
                    {this.renderAddUserButton()}
                </Form.Group>
            </Form>
        );
    }

    renderModalBody() {

        return(
            <Row className="g-2">
                <Col >
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
