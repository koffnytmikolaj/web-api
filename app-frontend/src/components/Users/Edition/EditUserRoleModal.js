import React, {Component} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

export class EditUserRoleModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            roleValue: 1,
            change: true,
            errorObjects: []
        }
    }
    
    connected = true;
    fetchPath = process.env.REACT_APP_API + 'user/ChangeRole';
    errorObjectSet = false;

    setErrorObject(result) {

        if(result)
            window.location.reload();
        else
            alert(result);
    }

    attachRole() {

        if(this.state.change) {
            this.setState({change: false});
            this.setState({roleValue: this.props.role_id});
        }
    }

    componentDidUpdate() {

        if(this.props.show)
            this.attachRole();
    }


    handleChange(event) {

        this.setState({roleValue: event.target.value});
    }

    sendQueryToDatabase(user) {

        fetch(this.fetchPath, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                UserId:         this.props.user_id,
                RoleId:         user.role.value
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
        if(window.confirm("Are You sure, You want to edit data of this user?"))
            this.sendQueryToDatabase(event.target);
    }


    renderChangeRoleButton() {

        return(
            <Button variant="primary" type="submit">
                Change
            </Button>
        );
    }
    
    renderNextRole(role) {

        return(
            <option value={role.RoleId} key={role.RoleId}>{role.RoleName}</option>
        );
    }

    renderRolesInTag() {

        let roleList = this.props.role_list;

        return(
            roleList.map(role => this.renderNextRole(role))
        );
    }

    renderForm() {

        return(
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Form.Group as={Col} controlId="role">
                        <FloatingLabel label="Role">
                            <Form.Control as="select" value={this.state.roleValue} onChange={this.handleChange} name="role">
                                {this.renderRolesInTag()}
                            </Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Form.Group>
                    {this.renderChangeRoleButton()}
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
