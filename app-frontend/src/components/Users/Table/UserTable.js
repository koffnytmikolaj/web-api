import { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { EditUserRoleModal } from '../Edition/EditUserRoleModal';

export class UserTable extends Component {

    constructor(props) {

        super(props);
        this.state = {
            updateModalShow: false
        }
    }

    deletePath = process.env.REACT_APP_API + 'user/DeleteUser';

    deleteUser(user) {

        if(window.confirm("Are You sure, You want to delete this user?")) {
            fetch(this.deletePath, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    UserId: user.UserId
                })
            }, (error) => {
                alert("Failed!\n" + error);
            })
            .then(result => result.json())
            .then(res => {
                window.location.reload();
            });
        }
    }


    renderEditButton(user) {

        return(
            <Button className="m-2 w-50" variant="info" disabled={user.IsDeleted} onClick={()=> 
                this.setState({
                        updateModalShow:    true,
                        UserId:             user.UserId,
                        Name:               user.Name,
                        Surname:            user.Surname,
                        DateOfBirth:        user.DateOfBirth.substr(0,10),
                        Login:              user.Login,
                        RoleId:             user.RoleId
                    }
                )
            }>
                {user.RoleName}
            </Button>
        );
    }

    renderEditUserModal() {

        let {UserId, RoleId} = this.state;
        

        return(
            <EditUserRoleModal 
                show={this.state.updateModalShow}
                onHide={()=> this.setState({updateModalShow: false})}
                user_id={UserId}
                role_id={RoleId}
                role_list={this.props.roleList}
            />
        );
    }

    renderDeleteButton(user, loggedUserRole) {

        let disabledButton = 
            ( (user.RoleId === 2 || user.RoleId === 3) && loggedUserRole !== 2);

        return(
            <Button className="m-2" variant="danger" disabled={disabledButton} onClick={()=> this.deleteUser(user)}>
                Delete
            </Button>
        );
    }
   
    renderEditionElements(user, loggedUserRole) {

        let deleteButtonShow =
            (loggedUserRole === 2 || loggedUserRole === 3) 
            ? "block"
            : "none";

        return(
                <span style={{display: deleteButtonShow}}>
                    {this.renderDeleteButton(user, loggedUserRole)}
                </span>
        );
    }
    
    renderRole(user, loggedUserRole) {

        if(loggedUserRole === 2)
            return (
                <span>
                    {this.renderEditButton(user)}
                    {this.renderEditUserModal()}
                </span>
            );
        else
            return (
                <span>{user.RoleName}</span>
            );
    }

    renderTableRow(user, loggedUserRole) {

        let displayEdition = loggedUserRole === 1 ? "none" : "block";

        return(
            <tr key={user.UserId}>
                <td>{user.Name}</td>
                <td>{user.Surname}</td>
                <td>{user.DateOfBirth}</td>
                <td>{user.Login}</td>
                <td>{this.renderRole(user, loggedUserRole)}</td>
                <td style={{display: displayEdition}}>{this.renderEditionElements(user, loggedUserRole)}</td>
            </tr>
        );
    }

    renderTableHead(loggedUserRole) {

        let displayEdition = loggedUserRole === 1 ? "none" : "block";

        return (
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Date of Birth</th>
                    <th>Login</th>
                    <th>Role</th>
                    <th style={{display: displayEdition}}>Edition</th>
                </tr>
            </thead>
        );
    }

    renderTableBody(loggedUserRole) {

        let userList =  this.props.userList;

        return(
            <tbody>
                {userList.map(user => this.renderTableRow(user, loggedUserRole))}
            </tbody>
        );
    }

    render() {

        let loggedUserRole = this.props.logged_user.RoleId;

        return(
            <Table className="mt-4" striped bordered hover size="sm">
                {this.renderTableHead(loggedUserRole)}
                {this.renderTableBody(loggedUserRole)}
            </Table>
        );
    }
}
