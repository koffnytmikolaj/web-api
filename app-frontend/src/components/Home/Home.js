import React from "react";
import Unauthorized from "./AuthorizationView/Unauthorized";
import Authorized from "./AuthorizationView/Authorized";
import { Carousel } from "react-bootstrap";

function Home(props) {

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
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/282c34/FFFFFF?text=&nbsp;"
                    alt="Second slide"
                    />

                    <Carousel.Caption>
                    <h3>Companies</h3>
                    <p>See all companies!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/20232a/FFFFFF?text=&nbsp;"
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <h3>Trade notes</h3>
                    <p>See all trade notes!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/373940/FFFFFF?text=&nbsp;"
                    alt="4th slide"
                    />
                    <Carousel.Caption>
                    <h3>Contact people</h3>
                    <p>See all contact people!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x200/282c34/FFFFFF?text=&nbsp;"
                    alt="5th slide"
                    />

                    <Carousel.Caption>
                    <h3>Industries</h3>
                    <p>See all industries!</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        );
    }

    function main() {

        let loggedUser = props.logged_user;

        if(loggedUser === 0 || loggedUser === -1)
            return (
                <>
                    <Unauthorized />
                    {renderCarousel()}
                </>
            );
        else
            return (
                <>
                    <Authorized logged_user={loggedUser} />
                    {renderCarousel()}
                </>
            );
    }

    return main();
}
export default Home;