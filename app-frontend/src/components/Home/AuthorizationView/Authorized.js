import React, {Component} from "react";
import { Card, Button } from "react-bootstrap";
import 'animate.css';
import "holderjs";
import { ShowUserDataModal } from "./Modals/ShowUserDataModal";
import { EditUserDataModal } from "./Modals/EditUserDataModal";
import { ChangePasswordModal } from "./Modals/ChangePasswordModal";

export class Authorized extends Component {

    getLongTimeElement(timeElement) {

        return timeElement >= 10 ? timeElement : "0" + timeElement;
    }

    getCurrentDate() {

        let time = new Date();

        let month = this.getLongTimeElement(Number(time.getMonth() + 1));
        let day = this.getLongTimeElement(time.getDate());
        let hours = this.getLongTimeElement(time.getHours());
        let minutes = this.getLongTimeElement(time.getMinutes());
        let seconds = this.getLongTimeElement(time.getSeconds());

        return (time.getFullYear() + "." + month + "." + day + " " + hours + ":" + minutes + ":" + seconds);
    }

    constructor(props) {

        super(props);
        this.state = {
            time : this.getCurrentDate()
        }
        
    }


    _isMounted = false;

    componentDidMount() {

        this._isMounted = true;
        this.interval = setInterval(() => this.setState({ time: this.getCurrentDate() }), 1000);
    }

    componentWillUnmount() {

        this._isMounted = false;
        clearInterval(this.interval);
    }
    

    renderShowButton() {

        let user = this.props.logged_user;
        return (
            <Button className="w-50" variant="primary" onClick={()=> 
                this.setState({
                        showModalShow:      true,
                        UserId:             user.UserId,
                        Name:               user.Name,
                        Surname:            user.Surname,
                        DateOfBirth:        user.DateOfBirth.substr(0,10),
                        Login:              user.Login,
                        RoleName:           user.RoleName
                    }
                )
            }>
                Show
            </Button>
        );
        
    }

    renderShowModal() {
        let {UserId, Name, Surname, DateOfBirth, Login, RoleName} = this.state;
        

            return(
                <ShowUserDataModal 
                    show={this.state.showModalShow}
                    onHide={()=> this.setState({showModalShow: false})}
                    user_id={UserId}
                    name={Name}
                    surname={Surname}
                    date_of_birth={DateOfBirth}
                    login={Login}
                    role_name={RoleName}
                    role_list={this.props.roleList}
                />
            );
    }

    renderShowCard() {

        return (
            <Card style={{ width: '18rem' }} className="mx-5 mt-2 d-flex justify-content-center">
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Text>Show Your account's data</Card.Text>
                    {this.renderShowButton()}
                    {this.renderShowModal()}
                </Card.Body>
            </Card>
        );
    }

    renderEditButton() {

        let user = this.props.logged_user;
        return (
            <Button className="w-50" variant="primary" onClick={()=> 
                this.setState({
                        editModalShow:    true,
                        UserId:             user.UserId,
                        Name:               user.Name,
                        Surname:            user.Surname,
                        DateOfBirth:        user.DateOfBirth.substr(0,10),
                        Login:              user.Login,
                        Role:               user.RoleId
                    }
                )
            }>
                Edit
            </Button>
        );
        
    }

    renderEditModal() {

        let {UserId, Name, Surname, DateOfBirth, Login, Role} = this.state;
        

            return(
                <EditUserDataModal 
                    show={this.state.editModalShow}
                    onHide={()=> this.setState({editModalShow: false})}
                    user_id={UserId}
                    name={Name}
                    surname={Surname}
                    date_of_birth={DateOfBirth}
                    login={Login}
                    role_id={Role}
                />
            );
    }

    renderEditCard() {

        return (
            <Card style={{ width: '18rem' }} className="mx-5 mt-2 d-flex justify-content-center">
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Text>Edit Your account's data</Card.Text>
                    {this.renderEditButton()}
                    {this.renderEditModal()}
                </Card.Body>
            </Card>
        );
    }

    renderChangePasswordButton() {
        let user = this.props.logged_user;

        return (
            <Button className="w-50" variant="primary" onClick={()=> 
                this.setState({
                        changePasswordModalShow:    true,
                        Login:                      user.Login
                    }
                )
            }>
                Edit
            </Button>
        );
    }

    renderChangePasswordModal() {

        let Login = this.state.Login;

            return(
                <ChangePasswordModal 
                    show={this.state.changePasswordModalShow}
                    onHide={()=> this.setState({changePasswordModalShow: false})}
                    login={Login}
                />
            );
    }

    renderChangePasswordCard() {

        return (
            <Card style={{ width: '18rem' }} className="mx-5 mt-2 d-flex justify-content-center">
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Text>Change Password</Card.Text>
                    {this.renderChangePasswordButton()}
                    {this.renderChangePasswordModal()}
                </Card.Body>
            </Card>
        );
    }
    
    renderSubCards() {

        return(
            <div className="d-flex justify-content-center">
                {this.renderShowCard()}
                {this.renderEditCard()}
                {this.renderChangePasswordCard()}
            </div>
        );
    }

    render() {

        return(
            <Card className="text-center m-5 d-flex justify-content-center rounded">
                <Card.Header>{this.state.time}</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome, {this.props.logged_user.Name} {this.props.logged_user.Surname}!</Card.Title>
                    {this.renderSubCards()}
                </Card.Body>
                <Card.Footer className="text-muted"></Card.Footer>
            </Card>
            
        );
    }
}
