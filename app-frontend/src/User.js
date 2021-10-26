import React, {Component} from "react";
import { Table, Button, ButtonToolbar, ButtonGroup } from "react-bootstrap";

import { AddUserModal } from "./AddUserModal";
import { EditUserModal } from "./EditUserModal";

export class User extends Component {
    
    constructor(props) {

        super(props);
        this.state = {
            userList: [],
            addModalShow: false,
            updateModalShow: false
        }
    }

    connected = true;
    showAll = false;
    availableUsersPath = process.env.REACT_APP_API + 'user/GetOnlyAvailableUsers';
    allUsersPath = process.env.REACT_APP_API + 'user/GetAllUsers';
    deletePath = process.env.REACT_APP_API + 'user/DeleteUser';
    restorePath = process.env.REACT_APP_API + 'user/RestoreUser';
    fetchPath = this.availableUsersPath;

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

    delete_RestoreUser(user) {

        let path = user.isDeleted ? this.restorePath : this.deletePath;
        if(window.confirm("Are You sure, You want to " + (user.isDeleted ? "restore" : "delete") + " this user?")) {
            fetch(path, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user.id
                })
            }, (error) => {
                alert("Failed!\n" + error);
            });
        }
    }


    renderEditButton(user) {

        return(
            <Button className="m-2" variant="info" disabled={user.isDeleted} onClick={()=> 
                this.setState({
                        updateModalShow:    true,
                        id:                 user.id,
                        name:               user.name,
                        surname:            user.surname,
                        dateOfBirth:        user.dateOfBirth.substr(0,10),
                        login:              user.login,
                        role:               user.role
                    }
                )
            }>
                Edit
            </Button>
        );
    }

    renderEditUserModal() {

        let {id, name, surname, dateOfBirth, login, role} = this.state;

        return(
            <EditUserModal 
                show={this.state.updateModalShow}
                onHide={()=> this.setState({updateModalShow: false})}
                id={id}
                name={name}
                surname={surname}
                date_of_birth={dateOfBirth}
                login={login}
                role={role}
            />
        );
    }

    renderDelete_RestoreButton(user) {

        let actionName = user.isDeleted ? 'Restore' : 'Delete';
        let actionVariant = user.isDeleted ? 'success' : 'danger';

        return(
            <Button className="m-2" variant={actionVariant} onClick={()=> this.delete_RestoreUser(user)}>
                {actionName}
            </Button>
        );
    }
   
    renderEditionElements(user) {

        return(
            <ButtonGroup>
                {this.renderEditButton(user)}
                {this.renderEditUserModal()}
                {this.renderDelete_RestoreButton(user)}
            </ButtonGroup>
        );
    }
    
    renderTableRow(user) {

        return(
            <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.dateOfBirth}</td>
                <td>{user.login}</td>
                <td>{user.roleName}</td>
                <td>{this.renderEditionElements(user)}</td>
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
                    <th>Edition</th>
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
        let clickPath = this.showAll ? this.availableUsersPath : this.allUsersPath;
        
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
                    Database failure! Come back later.
                </div>
            );
    }
}
