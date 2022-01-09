import React, {Component} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel, Alert } from "react-bootstrap";

export class EditUserDataModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            roleValue: 1,
            change: true,
            errorObjects: []
        }
    }
    
    connected = true;
    fetchPath = process.env.REACT_APP_API + 'user/EditUser';
    errorObjectSet = false;

    setErrorObject(result) {

        if(result === 1)
            window.location.reload();
        else
            this.setState({errorObjects: result});
    }

    sendQueryToDatabase(user) {

        fetch(this.fetchPath, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserId:         this.props.user_id,
                Name:           user.name.value,
                Surname:        user.surname.value,
                DateOfBirth:    user.dateOfBirth.value,
                RoleId:         this.props.role_id
            })
        }, (error) => {
            if(error) {
                this.connected = false;
                alert("Failed!\n" + error);
            }
            else
                this.connected = true;
        }).then(res => res.json()).then(result => {
            this.setErrorObject(result);
        });
        
    }

    handleSubmit(event) {
        
        event.preventDefault();
        if(window.confirm("Are You sure, You want to edit Your data?"))
            this.sendQueryToDatabase(event.target);
    }


    renderEditUserButton() {

        return(
            <Button variant="primary" type="submit">
                Edit User
            </Button>
        );
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

    renderForm() {

        return(
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="First Name">
                            <Form.Control type="text" name="name" required placeholder="First Name" defaultValue={this.props.name}></Form.Control>
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
                            <Form.Control type="text" name="surname" required placeholder="Family Name" defaultValue={this.props.surname}></Form.Control>
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
                            <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth" defaultValue={this.props.date_of_birth}></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}>
                        {this.renderAlert("date")}
                    </Form.Group>
                </Row>
                <br/>
                <Form.Group>
                    {this.renderEditUserButton()}
                </Form.Group>
            </Form>
        );
    }
    
    renderModalBody() {

        return(
            <Row className="g-2">
                <Col>
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
                        Edit User
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

        if(this.connected){
        
            return(
                <div className="container">
                    {this.renderModal()}
                </div>
            );
        }
        else
            return(
                <div>
                    Database failure! Come back later.
                </div>
            );
    }
}
