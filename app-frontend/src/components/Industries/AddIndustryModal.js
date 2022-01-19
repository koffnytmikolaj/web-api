import React, {useState} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

function AddIndustryModal(props) {

    const [connected, setConnected] = useState(true);
    
    const fetchPath = process.env.REACT_APP_API + 'industry/AddIndustry';

    function setErrorObject(result) {

        if(result)
            window.location.reload();
        else
            alert(result);
    }

    function sendQueryToDatabase(industry) {
        (
            async () => {
                fetch(fetchPath, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        IndustryName:   industry.name.value
                    })
                }, (error) => {
                    if(error) {
                        setConnected(false);
                        alert("Failed!\n" + error);
                    }
                    else
                        setConnected(true);
                }).then(res => res.json()).then(result => {
                    setErrorObject(result);
                });
            }
        )();
        
        
    }

    function handleSubmit(event) {
        
        event.preventDefault();
        if(window.confirm("Are You sure, You want to add this industry?"))
            sendQueryToDatabase(event.target);
    }


    function renderChangeIndustryButton() {

        return(
            <Button variant="primary" type="submit">
                Add
            </Button>
        );
    }

    function renderForm() {

        return(
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="Industry Name">
                            <Form.Control type="text" required placeholder="Industry Name" name="name" />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Form.Group>
                    {renderChangeIndustryButton()}
                </Form.Group>
            </Form>
        );
    }
    
    function renderModalBody() {

        return(
            <Row className="g-2">
                <Col>
                    {renderForm()}
                </Col>
            </Row>
        );
        
    }

    function renderHideButton() {

        return(
            <Button variant="danger" onClick={props.onHide}>
                Close
            </Button>
        );
    }

    function renderModal() {

        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Industry
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderModalBody()}
                </Modal.Body>
                
                <Modal.Footer>
                    {renderHideButton()}
                </Modal.Footer>
            </Modal>
        );
    }

    function main() {

        if(connected){
        
            return(
                <div className="container">
                    {renderModal()}
                </div>
            );
        }
        else
            return(
                <div>
                    Database failure! Come back later.
                </div>
            );
    }

    return main();
}
export default AddIndustryModal;