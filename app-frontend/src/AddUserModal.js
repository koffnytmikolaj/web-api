import React, {Component} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel, Alert } from "react-bootstrap";

export class AddUserModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            errorObject: ["", "", "", "", "", ""]
        }
    }
    
    fetchPath = process.env.REACT_APP_API + 'user/AddNewUser';
    errorObjectSet = false;
    
    setErrorObject(result) {

        console.log("result " + result);
        let resultObject = JSON.parse(result);
        let messageArray = [];

        console.log("object " + resultObject);

        //First name
        messageArray.push(resultObject["name"]           ? "" : "Type correct name!");
        console.log(messageArray);
        //Family name
        messageArray.push(resultObject["surname"]        ? "" : "Type correct surname!");
        console.log(messageArray);
        //Date of birth
        messageArray.push(resultObject["date"]           ? "" : "Type correct date of birth!");
        console.log(messageArray);
        //Login
        messageArray.push(
            resultObject["loginUniqueness"] ? (
                resultObject["loginLength"] ? "" : "The login must have 8 marks or more!"
            ) : "This login is already in use!"
        );
        console.log(messageArray);
        //Password
        console.log(messageArray);
        messageArray.push(resultObject["password"] ? "" : "The password must have 8 marks or more!");
        //Password repeat
        messageArray.push(resultObject["passwordRepeat"] ? "" : "Wrong password repeated!");
        console.log(messageArray);

        this.setState({errorObject: messageArray})
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
        if(window.confirm("Are You sure, You want to edit data of this user?"))
            this.sendQueryToDatabase(event.target);
    }

    checkVisibility(error) {
        
        return error === "" ? "invisible" : "visible";
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
                    <FloatingLabel label="First Name">
                        <Form.Control type="text" name="name" required placeholder="First Name"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <br/>
                <Form.Group controlId="surname">
                    <FloatingLabel label="Family Name">
                        <Form.Control type="text" name="surname" required placeholder="Family Name"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <br/>
                <Form.Group controlId="dateOfBirth">
                    <FloatingLabel label="Date of birth">
                        <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <br/>
                <Form.Group controlId="login">
                    <FloatingLabel label="Login">
                        <Form.Control type="text" name="login" required placeholder="Login"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <br/>
                <Form.Group controlId="password">
                    <FloatingLabel label="Password">
                        <Form.Control type="password" name="password" required placeholder="Password"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <br/>
                <Form.Group controlId="passwordRepeat">
                    <FloatingLabel label="Repeat password">
                        <Form.Control type="password" name="passwordRepeat" required placeholder="Repeat Password"></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                <br/>
                <Form.Group>
                    {this.renderAddUserButton()}
                </Form.Group>
            </Form>
        );
    }

    renderErrors() {

        let errorTab = this.state.errorObject;


        return(
            <Form>
                <FloatingLabel label="">
                    <Form.Control type="text" name="name" disabled className={"alert_input " + this.checkVisibility(errorTab[0])}  defaultValue={errorTab[0] }></Form.Control>
                </FloatingLabel>
                <br/>
                <FloatingLabel label="">
                    <Form.Control type="text" name="surname" disabled className={"alert_input " + this.checkVisibility(errorTab[1])} defaultValue={errorTab[1]}></Form.Control>
                </FloatingLabel>
                <br/>
                <FloatingLabel label="">
                    <Form.Control type="text" name="dateOfBirth" disabled className={"alert_input " + this.checkVisibility(errorTab[2])} defaultValue={errorTab[2]}></Form.Control>
                </FloatingLabel>
                <br/>
                <FloatingLabel label="">
                    <Form.Control type="text" name="login" disabled className={"alert_input " + this.checkVisibility(errorTab[3])} defaultValue={errorTab[3]}></Form.Control>
                </FloatingLabel>
                <br/>
                <FloatingLabel label="">
                    <Form.Control type="text" name="password" disabled className={"alert_input " + this.checkVisibility(errorTab[4])} defaultValue={errorTab[4]}></Form.Control>
                </FloatingLabel>
                <br/>
                <FloatingLabel label="">
                    <Form.Control type="text" name="passwordRepeat" disabled className={"alert_input " + this.checkVisibility(errorTab[5])} defaultValue={errorTab[5]}></Form.Control>
                </FloatingLabel>
                <br/>
                <Alert variant="danger">qwerty</Alert>
            </Form>
        );
    }

    renderModalBody() {

        return(
            <Row>
                <Col sm={6}>
                    {this.renderForm()}
                </Col>
                <Col sm={6}>
                    {this.renderErrors()}
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
