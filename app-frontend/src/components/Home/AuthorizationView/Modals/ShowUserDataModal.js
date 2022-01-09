import React, {Component} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

export class ShowUserDataModal extends Component {

    constructor(props) {

        super(props);
        this.state = {}
    }
    


    renderForm() {

        return(
            <Form>
                <Row>
                    <Form.Group as={Col} controlId="login">
                        <FloatingLabel label="Login">
                            <Form.Control type="text" name="login" required placeholder="Login" defaultValue={this.props.login} readOnly />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br />
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="First Name">
                            <Form.Control type="text" name="name" required placeholder="First Name" defaultValue={this.props.name} readOnly />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="surname">
                        <FloatingLabel label="Family Name">
                            <Form.Control type="text" name="surname" required placeholder="Family Name" defaultValue={this.props.surname} readOnly />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="dateOfBirth">
                        <FloatingLabel label="Date of birth">
                            <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth" defaultValue={this.props.date_of_birth} readOnly />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="role">
                        <FloatingLabel label="Role">
                            <Form.Control type="text" value={this.props.roleName} name="role" defaultValue={this.props.role_name} readOnly />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
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
                        {this.props.name} {this.props.surname}'s data
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
