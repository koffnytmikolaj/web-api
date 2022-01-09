import React, {Component} from "react";
import { Unauthorized } from "./AuthorizationView/Unauthorized";
import { Authorized } from "./AuthorizationView/Authorized";

export class Home extends Component {

    render() {

        let loggedUser = this.props.logged_user;

        if(loggedUser === 0 || loggedUser === -1)
            return <Unauthorized />;
        else
            return <Authorized logged_user={loggedUser} />;
    }
}
