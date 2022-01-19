import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { EditUserRoleModal } from '../Edition/EditUserRoleModal';

function UserTable(props){

    const [updateModalShow, setUpdateModalShow] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const deletePath = process.env.REACT_APP_API + 'user/DeleteUser';

    function deleteUser(user) {

        if(window.confirm("Are You sure, You want to delete this user?")) {
            fetch(deletePath, {
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


    function renderEditButton(user) {

        return(
            <Button className="m-2 w-50" variant="info" disabled={user.IsDeleted} onClick={()=> {
                setUpdateModalShow(true);
                setUserId(user.UserId);
                setUserRole(user.RoleId);
            }}>
                {user.RoleName}
            </Button>
        );
    }

    function renderEditUserModal() {

        return(
            <EditUserRoleModal 
                show={updateModalShow}
                onHide={()=> setUpdateModalShow(false)}
                user_id={userId}
                role_id={userRole}
                role_list={props.roleList}
            />
        );
    }

    function renderDeleteButton(user, loggedUserRole) {

        let disabledButton = 
            ( (user.RoleId === 2 || user.RoleId === 3) && loggedUserRole !== 2);

        return(
            <Button className="m-2" variant="danger" disabled={disabledButton} onClick={()=> deleteUser(user)}>
                Delete
            </Button>
        );
    }
   
    function renderEditionElements(user, loggedUserRole) {

        let deleteButtonShow =
            (loggedUserRole === 2 || loggedUserRole === 3) 
            ? "block"
            : "none";

        return(
                <span style={{display: deleteButtonShow}}>
                    {renderDeleteButton(user, loggedUserRole)}
                </span>
        );
    }
    
    function renderRole(user, loggedUserRole) {

        if(loggedUserRole === 2)
            return (
                <span>
                    {renderEditButton(user)}
                    {renderEditUserModal()}
                </span>
            );
        else
            return (
                <span>{user.RoleName}</span>
            );
    }

    function renderTableRow(user, loggedUserRole) {

        let displayEdition = loggedUserRole === 1 ? "none" : "block";

        return(
            <tr key={user.UserId}>
                <td>{user.Name}</td>
                <td>{user.Surname}</td>
                <td>{user.DateOfBirth}</td>
                <td>{user.Login}</td>
                <td>{renderRole(user, loggedUserRole)}</td>
                <td style={{display: displayEdition}}>{renderEditionElements(user, loggedUserRole)}</td>
            </tr>
        );
    }

    function renderTableHead(loggedUserRole) {

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

    function renderTableBody(loggedUserRole) {

        let userList =  props.userList;

        return(
            <tbody>
                {userList.map(user => renderTableRow(user, loggedUserRole))}
            </tbody>
        );
    }

    function main() {

        let loggedUserRole = props.logged_user.RoleId;

        return(
            <Table className="mt-4" striped bordered hover size="sm" responsive>
                {renderTableHead(loggedUserRole)}
                {renderTableBody(loggedUserRole)}
            </Table>
        );
    }

    return main();
}
export default UserTable;