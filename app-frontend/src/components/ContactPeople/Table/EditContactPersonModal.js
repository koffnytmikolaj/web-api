import React, {useState} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

function EditContactPersonModal(props) {

    const [connected, setConnected] = useState(true);
    
    const fetchPath = process.env.REACT_APP_API + 'contactPeople/EditContactPerson';

    function setErrorObject(result) {

        if(result === true)
            window.location.reload();
        else
            alert(result);
    }

    function sendQueryToDatabase(contactPerson) {
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
                        ContactPersonId:    props.cp_id,
                        Name:               contactPerson.name.value,
                        Surname:            contactPerson.surname.value,
                        PhoneNumber:        contactPerson.phone.value,
                        JobTitle:           contactPerson.job.value,
                        CompanyId:          contactPerson.company.value
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
        if(window.confirm("Are You sure, You want to edit this contact person?"))
            sendQueryToDatabase(event.target);
    }

    function handleChange() {
        
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
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="Name">
                            <Form.Control type="text" required placeholder="Name" name="name" defaultValue={props.cp_name} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="surname">
                        <FloatingLabel label="Surname">
                            <Form.Control type="text" required placeholder="Surname" name="surname" defaultValue={props.cp_surname} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="phone">
                        <FloatingLabel label="Phone number">
                            <Form.Control type="text" required placeholder="Phone number" name="phone" defaultValue={props.cp_phone} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="job">
                        <FloatingLabel label="Job title">
                            <Form.Control type="text" required placeholder="Job title" name="job" defaultValue={props.cp_job} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="company">
                        <FloatingLabel label="Company">
                            <Form.Control as="select" onChange={handleChange} name="company" defaultValue={props.cp_company}>
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
                        Edit Contact Person
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
export default EditContactPersonModal;