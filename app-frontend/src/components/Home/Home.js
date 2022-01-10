import React from "react";
import Unauthorized from "./AuthorizationView/Unauthorized";
import Authorized from "./AuthorizationView/Authorized";

function Home(props) {

    function main() {

        let loggedUser = props.logged_user;

        if(loggedUser === 0 || loggedUser === -1)
            return <Unauthorized />;
        else
            return <Authorized logged_user={loggedUser} />;
    }

    return main();
}
export default Home;