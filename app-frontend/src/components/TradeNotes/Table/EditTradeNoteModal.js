import React, {useState} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

function EditTradeNoteModal(props) {

    const [connected, setConnected] = useState(true);
    const [curCompany, setCurCompany] = useState(props.company);
    
    const fetchPath = process.env.REACT_APP_API + 'tradeNote/EditTradeNote';

    function setErrorObject(result) {

        if(result === true)
            window.location.reload();
        else
            alert(result);
    }

    function sendQueryToDatabase(tradeNote) {
        (
            async () => {
                fetch(fetchPath, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        CompanyId:      tradeNote.company.value,
                        NoteContent:    tradeNote.content.value,
                        TradeNoteId:    props.trade_note_id
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
        if(window.confirm("Are You sure, You want to edit this trade note?"))
            sendQueryToDatabase(event.target);
    }

    function handleChange(event) {
        setCurCompany(event.target.value);
    }


    function renderChangeCompanyButton() {

        return(
            <Button variant="primary" type="submit">
                Change
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
                            <Form.Control as="textarea" rows={6} required placeholder="Content" name="content" defaultValue={props.trade_note_content} />
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="company">
                        <FloatingLabel label="Company">
                            <Form.Control as="select" value={curCompany} onChange={handleChange} name="company" defaultValue={props.company_id}>
                                {renderCompaniesInTag()}
                            </Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br />
                <Form.Group>
                    {renderChangeCompanyButton()}
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
                        Edit Trade Note
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
export default EditTradeNoteModal;