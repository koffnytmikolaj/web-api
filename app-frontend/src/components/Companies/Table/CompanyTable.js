import { useState } from 'react';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';
import EditCompanyModal from './EditCompanyModal';

function CompanyTable(props){

    const [updateModalShow, setUpdateModalShow] = useState(false);
    const [companyId, setCompanyId] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [industryId, setIndustryId] = useState(null);
    const [companyAddress, setCompanyAddress] = useState(null);
    const [companyLocalization, setCompanyLocalization] = useState(null);

    const deletePath = process.env.REACT_APP_API + 'company/DeleteCompany';


    function deleteCompany(company) {

        if(window.confirm("Are You sure, You want to delete this company?"))
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
                            CompanyId: company.CompanyId
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

    function renderDeleteButton(company) {

        return(
            <Button className="m-2" variant="danger" onClick={()=> deleteCompany(company)}>
                Delete
            </Button>
        );
    }
    
    function renderEditButton(company) {

        return(
            <Button className="m-2" variant="info" onClick={()=> {
                setUpdateModalShow(true);
                setCompanyId(company.CompanyId);
                setCompanyName(company.Name);
                setIndustryId(company.IndustryId);
                setCompanyAddress(company.Address);
                setCompanyLocalization(company.Localization);
            }}>
                Edit
            </Button>
        );
    }

    function renderEditModal() {

        return(
            <EditCompanyModal 
                show={updateModalShow}
                onHide={()=> setUpdateModalShow(false)}
                company_id={companyId}
                company_name={companyName}
                industry={industryId}
                company_address={companyAddress}
                company_localization={companyLocalization}
                industry_list={props.industry_list}
            />
        );
    }
   
    function renderEditionElements(company, loggedUserRole) {

        let editButtonShow = loggedUserRole === 2 ? "block" : "none";

        return(
            <>
                <ButtonToolbar style={{display: editButtonShow}}>
                    {renderEditButton(company)}
                    {renderDeleteButton(company)}
                </ButtonToolbar>
                {renderEditModal()}
            </>
        );
    }

    function renderTableRow(company, loggedUserRole) {

        let displayEdition = loggedUserRole === 2 ? "block" : "none";

        return(
            <tr key={company.CompanyId}>
                <td>{company.Name}</td>
                <td>{company.Nip}</td>
                <td>{company.IndustryName}</td>
                <td>{company.Address}</td>
                <td>{company.Localization}</td>
                <td>{company.Login}</td>
                <td>{company.DateOfAdd.substring(0,10)}</td>
                <td style={{display: displayEdition}}>{renderEditionElements(company, loggedUserRole)}</td>
            </tr>
        );
    }

    function renderTableHead(loggedUserRole) {

        let displayEdition = loggedUserRole === 2 ? "block" : "none";

        return (
            <thead>
                <tr>
                    <th>Name</th>
                    <th>NIP</th>
                    <th>Industry</th>
                    <th>Address</th>
                    <th>Localization</th>
                    <th>Adding User</th>
                    <th>Date of add</th>
                    <th style={{display: displayEdition}}>Edit</th>
                </tr>
            </thead>
        );
    }

    function renderTableBody(loggedUserRole) {

        let companyList =  props.company_list;

        return(
            <tbody>
                {companyList.map(company => renderTableRow(company, loggedUserRole))}
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
export default CompanyTable;