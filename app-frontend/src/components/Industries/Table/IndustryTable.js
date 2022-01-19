import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import EditIndustryModal from './EditIndustryModal';

function IndustryTable(props){

    const [updateModalShow, setUpdateModalShow] = useState(false);
    const [industryId, setIndustryId] = useState(null);
    const [industryName, setIndustryName] = useState(null);


    function renderEditButton(industry) {

        return(
            <Button className="m-2" variant="info" onClick={()=> {
                setUpdateModalShow(true);
                setIndustryId(industry.IndustryId);
                setIndustryName(industry.IndustryName);
            }}>
                Edit name
            </Button>
        );
    }

    function renderEditIndustryModal() {

        return(
            <EditIndustryModal 
                show={updateModalShow}
                onHide={()=> setUpdateModalShow(false)}
                industry_id={industryId}
                industry_name={industryName}
            />
        );
    }
   
    function renderEditionElements(industry, loggedUserRole) {

        let editButtonShow = loggedUserRole === 2 ? "block" : "none";

        return(
            <span style={{display: editButtonShow}}>
                {renderEditButton(industry)}
                {renderEditIndustryModal()}
            </span>
        );
    }

    function renderTableRow(industry, loggedUserRole) {

        let displayEdition = loggedUserRole === 2 ? "block" : "none";

        return(
            <tr key={industry.IndustryId}>
                <td>{industry.IndustryName}</td>
                <td style={{display: displayEdition}}>{renderEditionElements(industry, loggedUserRole)}</td>
            </tr>
        );
    }

    function renderTableHead(loggedUserRole) {

        let displayEdition = loggedUserRole === 2 ? "block" : "none";

        return (
            <thead>
                <tr>
                    <th>Industry</th>
                    <th style={{display: displayEdition}}>Edit</th>
                </tr>
            </thead>
        );
    }

    function renderTableBody(loggedUserRole) {

        let industryList =  props.industryList;

        return(
            <tbody>
                {industryList.map(industry => renderTableRow(industry, loggedUserRole))}
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
export default IndustryTable;