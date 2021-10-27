import React, {Component} from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

export class EditUserModal extends Component {

    constructor(props) {

        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            roleValue: 1,
            roleList: []
        }
    }
    
    change = true;
    connected = true;
    fetchPath = process.env.REACT_APP_API + 'user/EditUser';
    rolePath = process.env.REACT_APP_API + 'role/GetRoles';

    getRoles() {

        fetch(this.rolePath).then(response => 
            response.json(),
                (error) => {
                    if(error) {
                        this.connected = false;
                        alert("Failed!\n" + error);
                    }
                    else
                        this.connected = true;
                }
            ).then(data => {
                this.setState({roleList:data});
            }
        );
    }

    attachRole() {

        if(this.change) {
            this.change = false;
            this.setState({roleValue: this.props.role});
        }
    }

    componentDidMount() {

        this.getRoles();
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
            body: JSON.stringify({
                id:             this.props.id,
                name:           user.name.value,
                surname:        user.surname.value,
                dateOfBirth:    user.dateOfBirth.value,
                login:          user.login.value,
                role:           user.role.value
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
                Edit User
            </Button>
        );
    }
    
    renderNextRole(role) {

        return(
            <option value={role.id} key={role.id}>{role.roleName}</option>
        );
    }

    renderRolesInTag() {

        let roleList = this.state.roleList;

        return(
            roleList.map(role => this.renderNextRole(role))
        );
    }

    renderForm() {

        return(
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="name" required placeholder="First Name" defaultValue={this.props.name}></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="surname">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control type="text" name="surname" required placeholder="Family Name" defaultValue={this.props.surname}></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="dateOfBirth">
                    <Form.Label>Date Of Birth</Form.Label>
                    <Form.Control type="date" name="dateOfBirth" required placeholder="Date Of Birth" defaultValue={this.props.date_of_birth}></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="login">
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="text" name="login" required placeholder="Login" defaultValue={this.props.login}></Form.Control>
                </Form.Group>
                <br/>
                <Form.Group controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Control as="select" value={this.state.roleValue} onChange={this.handleChange} name="role">
                        {this.renderRolesInTag()}
                    </Form.Control>
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
