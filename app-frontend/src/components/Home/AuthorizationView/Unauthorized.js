import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'animate.css';
import "holderjs";

function Unauthorized() {
    
    function renderCards() {

        return (
            <div className="m-5 d-flex justify-content-center">
                <Card style={{ width: '18rem' }} className="m-5 d-flex justify-content-center">
                    <Card.Header>
                        <Card.Title>Welcome to my App!</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            If You want to use this application,
                        </Card.Text>
                        <Link to="/login"><Button variant="primary">Sign in!</Button></Link>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }} className="m-5 d-flex justify-content-center">
                    <Card.Header>
                        <Card.Title>Cross the borders!</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Haven't You got an account yet?
                        </Card.Text>
                        <Link to="/register"><Button variant="primary">Sign up!</Button></Link>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    function main() {

        return(
            <div>
                {renderCards()}
            </div>
        );
    }

    return main();
}
export default Unauthorized;