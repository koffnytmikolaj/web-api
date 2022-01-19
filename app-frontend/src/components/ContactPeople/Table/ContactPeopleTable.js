import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import EditContactPersonModal from './EditContactPersonModal';

function ContactPersonTable(props){

    const [updateModalShow, setUpdateModalShow] = useState(false);
    const [contactPersonId, setContactPersonId] = useState(null);
    const [contactPersonName, setContactPersonName] = useState(null);
    const [contactPersonSurname, setContactPersonSurname] = useState(null);
    const [contactPersonPhoneNumber, setContactPersonPhoneNumber] = useState(null);
    const [contactPersonJob, setContactPersonJob] = useState(null);
    const [contactPersonCompany, setContactPersonCompany] = useState(null);

    const deletePath = process.env.REACT_APP_API + 'contactPeople/DeleteContactPerson';


    function deleteCompany(contactPerson) {

        if(window.confirm("Are You sure, You want to delete this contact person?"))
            (
                async () => {
                    await fetch(deletePath, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            ContactPersonId: contactPerson.ContactPersonId
                        })
                    }, (error) => {
                        alert("Failed!\n" + error);
                    })
                    .then(result => result.json())
                    .then(res => {
                        window.location.reload();
                    });
                }
            )();
    }

    function renderDeleteButton(contactPerson) {

        return(
            <Button className="m-2" variant="danger" onClick={()=> deleteCompany(contactPerson)}>
                Delete
            </Button>
        );
    }
    
    function renderEditButton(contactPerson) {

        return(
            <Button className="m-2" variant="info" onClick={()=> {
                setUpdateModalShow(true);
                setContactPersonId(contactPerson.ContactPersonId);
                setContactPersonName(contactPerson.Name);
                setContactPersonSurname(contactPerson.Surname);
                setContactPersonPhoneNumber(contactPerson.PhoneNumber);
                setContactPersonJob(contactPerson.JobTitle);
                setContactPersonCompany(contactPerson.CompanyId);
            }}>
                Edit
            </Button>
        );
    }

    function renderEditModal() {

        return(
            <EditContactPersonModal 
                show={updateModalShow}
                onHide={()=> setUpdateModalShow(false)}
                cp_id={contactPersonId}
                cp_name={contactPersonName}
                cp_surname={contactPersonSurname}
                cp_phone={contactPersonPhoneNumber}
                cp_job={contactPersonJob}
                cp_company={contactPersonCompany}
                company_list={props.company_list}
            />
        );
    }
   
    function renderEditionElements(contactPerson) {

        return(
            <>
                {renderEditButton(contactPerson)}
                {renderDeleteButton(contactPerson)}
                {renderEditModal()}
            </>
        );
    }

    function renderTableRow(contactPerson, loggedUserRole) {

        let displayEdition = (loggedUserRole === 1 || loggedUserRole === 3) ? "none" : "block";

        return(
            <tr key={contactPerson.ContactPersonId}>
                <td>{contactPerson.Name}</td>
                <td>{contactPerson.Surname}</td>
                <td>{contactPerson.PhoneNumber}</td>
                <td>{contactPerson.Email}</td>
                <td>{contactPerson.JobTitle}</td>
                <td>{contactPerson.CompanyName} ({contactPerson.Nip})</td>
                <td>{contactPerson.Login}</td>
                <td style={{display: displayEdition}}>{renderEditionElements(contactPerson, loggedUserRole)}</td>
            </tr>
        );
    }

    function renderTableHead(loggedUserRole) {

        let displayEdition = loggedUserRole === 2 ? "block" : "none";

        return (
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Phone number</th>
                    <th>E-mail</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Adding user</th>
                    <th style={{display: displayEdition}}>Edit</th>
                </tr>
            </thead>
        );
    }

    function renderTableBody(loggedUserRole) {

        let contactPeopleList =  props.contact_people_list;

        return(
            <tbody>
                {contactPeopleList.map(contactPerson => renderTableRow(contactPerson, loggedUserRole))}
            </tbody>
        );
    }

    function main() {

        let loggedUserRole = props.logged_user.RoleId;

        return(
            <Table className="mt-4" striped bordered hover size="sm" responsive>
                {renderTableHead(loggedUserRole)}
                {renderTableBody(loggedUserRole)}
            </Table>
        );
    }

    return main();
}
export default ContactPersonTable;