import React, {Component} from "react";
import { Table } from "react-bootstrap";

export class User extends Component {
    
    constructor(props) {
        super(props);
        this.state={userList:[]}
    }

    showAll = false;

    refreshList() {
        fetch(process.env.REACT_APP_API+'user').then(response => 
            response.json()).then(data =>
                this.setState({userList:data})
        );
    }

    componentDidMount() {
        this.refreshList();
    }

    componentDidUpdate() {
        this.refreshList();
    }


    showAllUsers() {
        this.showAll = !this.showAll;
        this.refreshList();
    }

    renderTableRow(user) {
        if(!user.isDeleted || this.showAll)
            return(
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.dateOfBirth}</td>
                    <td>{user.login}</td>
                    <td>{user.role}</td>
                    <td>edit</td>
                </tr>
            );
    }

    render() {

        const {userList}=this.state;
        return(
            <div>
                <Table className="mt-4" striped bordered hover size="sm">
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
                    <tbody>
                        {userList.map(user => this.renderTableRow(user))}
                    </tbody>
                </Table>
                <button onClick={this.showAllUsers()}>Show All</button>
            </div>
        );
    }
}
