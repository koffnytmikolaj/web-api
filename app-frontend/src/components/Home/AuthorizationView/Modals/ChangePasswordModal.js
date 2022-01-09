import React, {Component} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

export class ChangePasswordModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            roleValue: 1,
            change: true,
            wrongPassword: ""
        }
    }
    
    connected = true;
    fetchPath = process.env.REACT_APP_API + 'user/ChangePassword';
    

    setErrorObject(result) {

        if(result == null)
            window.location.reload();
        else
            this.setState({wrongPassword: result});
    }

    sendQueryToDatabase(user) {

        fetch(this.fetchPath, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Login:          this.props.login,
                Password:       user.password.value,
                NewPassword:    user.newPassword.value
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
        if(window.confirm("Are You sure, You want to change Your password?"))
            this.sendQueryToDatabase(event.target);
    }


    renderChangePasswordButton() {

        return(
            <>
            <Button variant="primary" type="submit">
                Change Password
            </Button>
          </>
        );
    }

    checkError() {
        
        if(this.state.wrongPassword != null)
            return (
                <span style={{color: "red"}}>{this.state.wrongPassword}</span>
            );
        else
            return null;
    }

    renderForm() {

        return(
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Form.Group as={Col} controlId="password">
                        <FloatingLabel label="Current Password">
                            <Form.Control type="password" name="password" required placeholder="Current Password"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="newPassword">
                        <FloatingLabel label="New Password">
                            <Form.Control type="password" name="newPassword" required placeholder="New Password"></Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Form.Group>
                    {this.checkError()}
                    <br/>
                    {this.renderChangePasswordButton()}
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
