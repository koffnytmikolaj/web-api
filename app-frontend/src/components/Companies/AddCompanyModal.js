import React, {useState} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel } from "react-bootstrap";

function AddCompanyModal(props) {

    const [connected, setConnected] = useState(true);
    const [curIndustry, setCurIndustry] = useState(props.industry_list !== [] ? props.industry_list[0].IndustryId : null);
    
    const fetchPath = process.env.REACT_APP_API + 'company/AddCompany';

    function setErrorObject(result) {

        if(result === true)
            window.location.reload();
        else
            console.log(result);
    }

    function sendQueryToDatabase(company) {
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
                        Name:   company.name.value,
                        Nip: company.nip.value,
                        IndustryId: company.industry.value,
                        Address: company.address.value,
                        Localization: company.localization.value
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
        if(window.confirm("Are You sure, You want to add this company?"))
            sendQueryToDatabase(event.target);
    }

    function handleChange(event) {
        setCurIndustry(event.target.value);
    }


    function renderChangeIndustryButton() {

        return(
            <Button variant="primary" type="submit">
                Add
            </Button>
        );
    }

    function renderNextRole(industry) {

        return(
            <option value={industry.IndustryId} key={industry.IndustryId}>{industry.IndustryName}</option>
        );
    }

    function renderIndustriesInTag() {
        
        return(
            props.industry_list.map(industry => renderNextRole(industry))
        );
    }

    function renderForm() {

        return(
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Form.Group as={Col} controlId="name">
                        <FloatingLabel label="Company Name">
                            <Form.Control type="text" required placeholder="Company Name" name="name" />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="nip">
                        <FloatingLabel label="NIP (000-000-00-00)">
                            <Form.Control type="text" pattern="^(\d{3}[- ]\d{3}[- ]\d{2}[- ]\d{2})$"
                                required placeholder="NIP (000-000-00-00)" name="nip" />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="industry">
                        <FloatingLabel label="Industry">
                            <Form.Control as="select" value={curIndustry} onChange={handleChange} name="industry">
                                {renderIndustriesInTag()}
                            </Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br />
                <Row>
                    <Form.Group as={Col} controlId="address">
                        <FloatingLabel label="Address">
                            <Form.Control type="text" required placeholder="Address" name="address" />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="localization">
                        <FloatingLabel label="Localization">
                            <Form.Control type="text" required placeholder="Localization" name="localization" />
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
                        Add Company
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
export default AddCompanyModal;