import React, {useState, useRef} from "react";
import { Modal, Button, Row, Col, Form, FloatingLabel, Overlay } from "react-bootstrap";

function EditCompanyModal(props) {

    const [connected, setConnected] = useState(true);
    const [errorObjects, setErrorObjects] = useState([]);

    const nameTarget = useRef(null);
    const industryTarget = useRef(null);
    const addressTarget = useRef(null);
    const localizationTarget = useRef(null);
    
    const fetchPath = process.env.REACT_APP_API + 'company/EditCompany';

    function setErrorObject(result) {

        if(result === true)
            window.location.reload();
        else
            setErrorObjects(result);
    }

    function sendQueryToDatabase(company) {
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
                        CompanyId:      props.company_id,
                        Name:           company.name.value,
                        IndustryId:     company.industry.value,
                        Address:        company.address.value,
                        Localization:   company.localization.value
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
        if(window.confirm("Are You sure, You want to edit name of this industry?"))
            sendQueryToDatabase(event.target);
    }

    function handleChange() {
    }


    function checkError(errorObject) {
        
        return errorObject !== undefined && errorObject !== "";
    }

    function renderOverlay(errorKey, target) {

        let errorObject = errorObjects[errorKey];
        if(checkError(errorObject)) {
            return(
                <Overlay target={target.current} placement="right" show={true}>
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div
                        {...props}
                        style={{
                        backgroundColor: 'rgba(255, 100, 100, 0.85)',
                        padding: '2px 10px',
                        color: 'white',
                        borderRadius: 3,
                        ...props.style,
                        }}
                    >
                        {errorObject}
                    </div>
                    )}
                </Overlay>
            );
        }
    }

    function renderChangeCompanyButton() {

        return(
            <Button variant="primary" type="submit">
                Change
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
                        <FloatingLabel label="Company Name" ref={nameTarget}>
                            <Form.Control type="text" required placeholder="Company Name" name="name" defaultValue={props.company_name} />
                        </FloatingLabel>
                    </Form.Group>
                    {renderOverlay("name", nameTarget)}
                    <Form.Group as={Col}></Form.Group>
                    
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="industry">
                        <FloatingLabel label="Industry" ref={industryTarget}>
                            <Form.Control as="select" onChange={handleChange} name="industry" defaultValue={props.industry}>
                                {renderIndustriesInTag()}
                            </Form.Control>
                        </FloatingLabel>
                    </Form.Group>
                    {renderOverlay("industry", industryTarget)}
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br />
                <Row>
                    <Form.Group as={Col} controlId="address">
                        <FloatingLabel label="Address" ref={addressTarget}>
                            <Form.Control type="text" required placeholder="Address" name="address" defaultValue={props.company_address} />
                        </FloatingLabel>
                    </Form.Group>
                    {renderOverlay("address", addressTarget)}
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <Row>
                    <Form.Group as={Col} controlId="localization">
                        <FloatingLabel label="Localization" ref={localizationTarget}>
                            <Form.Control type="text" required placeholder="Localization" name="localization" defaultValue={props.company_localization} />
                        </FloatingLabel>
                    </Form.Group>
                    {renderOverlay("localization", localizationTarget)}
                    <Form.Group as={Col}></Form.Group>
                </Row>
                <br/>
                <br/>
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
                        Edit Company
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
export default EditCompanyModal;