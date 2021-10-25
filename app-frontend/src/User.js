import React, {Component} from "react";
import { Table, Button, ButtonToolbar } from "react-bootstrap";

import { AddUserModal } from "./AddUserModal";

export class User extends Component {
    
    constructor(props) {

        super(props);
        this.state = {
            userList: [],
            addModalShow: false
        }
    }

    connected = true;
    showAll = true;
    fetchPath = process.env.REACT_APP_API + 'user/GetAllUsers';

    refreshList() {

        fetch(this.fetchPath).then(response => 
            response.json(),
                (error) => {
                    if(error)
                        this.connected = false;
                    else
                        this.connected = true;
                }
            ).then(data => {
                this.setState({userList:data});
            }
        );
    }

    componentDidMount() {

        this.refreshList();
    }

    componentDidUpdate() {

        if(this.connected)
            this.refreshList();
    }


    renderTableRow(user) {

        let actionName = user.isDeleted ? 'restore' : 'delete';

        return(
            <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.dateOfBirth}</td>
                <td>{user.login}</td>
                <td>{user.roleName}</td>
                <td>edit / {actionName}</td>
            </tr>
        );
    }

    renderTableHead() {

        return (
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Date of Birth</th>
                    <th>Login</th>
                    <th>Role</th>
                    <th>Edit</th>
                </tr>
            </thead>
        );
    }

    renderTableBody() {

        let userList =  this.state.userList;

        return(
            <tbody>
                {userList.map(user => this.renderTableRow(user))}
            </tbody>
        );
    }

    renderTable() {

        return(
            <Table className="mt-4" striped bordered hover size="sm">
                {this.renderTableHead()}
                {this.renderTableBody()}
            </Table>
        );
    }

    renderShowUsersButton() {

        let buttonName = this.showAll ? 'Show available users' : 'Show all users';
        let clickPath = process.env.REACT_APP_API + (this.showAll ? 'user/GetOnlyAvailableUsers' : 'user/GetAllUsers');
        
        return(
            <Button
                variant='primary' 
                onClick={()=> {
                    this.fetchPath = clickPath;
                    this.showAll = !this.showAll;
                }}
            >
                {buttonName}
            </Button>
        );
    }

    renderAddUserButton() {

        return (
            <Button variant='primary' onClick={()=> this.setState({addModalShow: true})}>
                Add User
            </Button>
        );
    }

    renderAddUserModal() {

        return (<AddUserModal show={this.state.addModalShow} onHide={()=> this.setState({addModalShow: false})}/>);
    }

    renderButtonToolbar() {

        return(
            <ButtonToolbar>
                {this.renderShowUsersButton()}
                {this.renderAddUserButton()}
                {this.renderAddUserModal()}
            </ButtonToolbar>
        );
    }

    render() {

        if(this.connected)
            return(
                <div>
                    {this.renderTable()}
                    {this.renderButtonToolbar()}
                </div>
            );
        else
            return(
                <div>
                    Connect with the database first.
                </div>
            );
    }
}
