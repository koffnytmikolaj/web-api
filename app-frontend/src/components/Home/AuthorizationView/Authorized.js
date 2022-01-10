import React, {useEffect, useState} from "react";
import { Card, Button } from "react-bootstrap";
import 'animate.css';
import "holderjs";
import { ShowUserDataModal } from "./Modals/ShowUserDataModal";
import { EditUserDataModal } from "./Modals/EditUserDataModal";
import { ChangePasswordModal } from "./Modals/ChangePasswordModal";
import GetCurrentDate from "../../GlobalFunctions/GetCurrentDate";

function Authorized(props) {

    const [time, setTime] = useState(<GetCurrentDate />);

    const [changePasswordModalShow, setChangePasswordModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [showModalShow, setShowModalShow] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(<GetCurrentDate />);
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    function renderShowButton() {

        return (
            <Button className="w-50" variant="primary" onClick={()=> {
                setShowModalShow(true);
            }}>
                Show
            </Button>
        );
        
    }

    function renderShowModal() {

        let user = props.logged_user;

            return(
                <ShowUserDataModal 
                    show={showModalShow}
                    onHide={()=> setShowModalShow(false)}
                    user_id={user.UserId}
                    name={user.Name}
                    surname={user.Surname}
                    date_of_birth={user.DateOfBirth}
                    login={user.Login}
                    role_name={user.RoleName}
                    role_list={props.roleList}
                />
            );
    }

    function renderShowCard() {

        return (
            <Card style={{ width: '18rem' }} className="mx-5 mt-2 d-flex justify-content-center">
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Text>Show Your account's data</Card.Text>
                    {renderShowButton()}
                    {renderShowModal()}
                </Card.Body>
            </Card>
        );
    }

    function renderEditButton() {

        return (
            <Button className="w-50" variant="primary" onClick={()=> {
                setEditModalShow(true);
            }}>
                Edit
            </Button>
        );
        
    }

    function renderEditModal() {
        
        let user = props.logged_user;

        return(
            <EditUserDataModal 
                show={editModalShow}
                onHide={()=> setEditModalShow(false)}
                user_id={user.UserId}
                name={user.Name}
                surname={user.Surname}
                date_of_birth={user.DateOfBirth.substr(0, 10)}
                role_id={user.RoleId}
            />
        );
    }

    function renderEditCard() {

        return (
            <Card style={{ width: '18rem' }} className="mx-5 mt-2 d-flex justify-content-center">
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Text>Edit Your account's data</Card.Text>
                    {renderEditButton()}
                    {renderEditModal()}
                </Card.Body>
            </Card>
        );
    }

    function renderChangePasswordButton() {

        return (
            <Button className="w-50" variant="primary" onClick={()=> {
                setChangePasswordModalShow(true);
            }}>
                Edit
            </Button>
        );
    }

    function renderChangePasswordModal() {

            return(
                <ChangePasswordModal 
                    show={changePasswordModalShow}
                    onHide={()=> setChangePasswordModalShow(false)}
                    login={props.logged_user.Login}
                />
            );
    }

    function renderChangePasswordCard() {

        return (
            <Card style={{ width: '18rem' }} className="mx-5 mt-2 d-flex justify-content-center">
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Text>Change Password</Card.Text>
                    {renderChangePasswordButton()}
                    {renderChangePasswordModal()}
                </Card.Body>
            </Card>
        );
    }
    
    function renderSubCards() {

        return(
            <div className="d-flex justify-content-center">
                {renderShowCard()}
                {renderEditCard()}
                {renderChangePasswordCard()}
            </div>
        );
    }

    function main() {

        return(
            <Card className="text-center m-5 d-flex justify-content-center rounded">
                <Card.Header>{time}</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome, {props.logged_user.Name} {props.logged_user.Surname}!</Card.Title>
                    {renderSubCards()}
                </Card.Body>
                <Card.Footer className="text-muted"></Card.Footer>
            </Card>
            
        );
    }

    return main();
}
export default Authorized;