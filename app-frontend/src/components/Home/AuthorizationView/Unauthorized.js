import React from "react";
import { Card, Button, Carousel } from "react-bootstrap";
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
                        <Card.Title>Welcome to my App!</Card.Title>
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

    function renderCarousel() {

        return (
            <Carousel className="d-flex justify-content-center">
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/373940/FFFFFF?text=&nbsp;"
                    alt="First slide"
                    />
                    <Carousel.Caption>
                    <h3>Users</h3>
                    <p>See all application users!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                {/* <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/282c34/FFFFFF?text=&nbsp;"
                    alt="Second slide"
                    />

                    <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/20232a/FFFFFF?text=&nbsp;"
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item> */}
            </Carousel>
        );
    }

    function main() {

        return(
            <div>
                {renderCards()}
                {renderCarousel()}
            </div>
        );
    }

    return main();
}
export default Unauthorized;