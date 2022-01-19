import React, {useState} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

function AddTradeNoteModal(props) {

    const [connected, setConnected] = useState(true);
    const [curCompany, setCurCompany] = useState(props.company_list !== [] ? props.company_list[0].CompanyId : null);
    
    const fetchPath = process.env.REACT_APP_API + 'tradeNote/AddTradeNote';

    function setErrorObject(result) {

        if(result === true)
            window.location.reload();
        else
            console.log(result);
    }

    function sendQueryToDatabase(tradeNote) {
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
                        NoteContent:   tradeNote.content.value,
                        CompanyId: tradeNote.company.value
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
        if(window.confirm("Are You sure, You want to add this trade note?"))
            sendQueryToDatabase(event.target);
    }

    function handleChange(event) {
        setCurCompany(event.target.value);
    }


    function renderChangeTradeNoteButton() {

        return(
            <Button variant="primary" type="submit">
                Add
            </Button>
        );
    }

    function renderNextCompany(company) {

        return(
            <option value={company.CompanyId} key={company.CompanyId}>{company.Name} ({company.Nip})</option>
        );
    }

    function renderCompaniesInTag() {
        
        return(
            props.company_list.map(company => renderNextCompany(company))
        );
    }

    function renderForm() {

        return(
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Form.Group as={Col} controlId="content">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows={6} required placeholder="Content" name="content" />
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="company">
                        <FloatingLabel label="Company">
                            <Form.Control as="select" value={curCompany} onChange={handleChange} name="company">
                                {renderCompaniesInTag()}
                            </Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br />
                <Form.Group>
                    {renderChangeTradeNoteButton()}
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
                        Add Trade Note
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
export default AddTradeNoteModal;