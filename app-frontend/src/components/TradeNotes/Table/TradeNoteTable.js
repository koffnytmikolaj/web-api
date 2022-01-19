import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import EditTradeNoteModal from './EditTradeNoteModal';

function TradeNoteTable(props){

    const [updateModalShow, setUpdateModalShow] = useState(false);
    const [tradeNoteCompany, setTradeNoteCompany] = useState(null);
    const [tradeNoteId, setTradeNoteId] = useState(null);
    const [tradeNoteContent, setTradeNoteContent] = useState(null);

    const deletePath = process.env.REACT_APP_API + 'tradeNote/DeleteTradeNote';


    function deleteCompany(tradeNote) {

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
                            TradeNoteId: tradeNote.TradeNoteId
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
    
    function renderEditButton(tradeNote) {

        return(
            <Button className="m-2" variant="info" onClick={()=> {
                setUpdateModalShow(true);
                setTradeNoteId(tradeNote.TradeNoteId);
                setTradeNoteContent(tradeNote.NoteContent);
                setTradeNoteCompany(tradeNote.CompanyId);
            }}>
                Edit
            </Button>
        );
    }

    function renderEditModal() {

        return(
            <EditTradeNoteModal 
                show={updateModalShow}
                onHide={()=> setUpdateModalShow(false)}
                company_id={tradeNoteCompany}
                trade_note_id={tradeNoteId}
                trade_note_content={tradeNoteContent}
                company_list={props.company_list}
            />
        );
    }
   
    function renderEditionElements(tradeNote, loggedUserRole) {

        return(
            <>
                {renderEditButton(tradeNote)}
                {renderDeleteButton(tradeNote)}
                {renderEditModal()}
            </>
        );
    }

    function renderTableRow(tradeNote, loggedUserRole) {

        let displayEdition = (loggedUserRole === 1 || loggedUserRole === 3) ? "none" : "block";

        return(
            <tr key={tradeNote.TradeNoteId}>
                <td>{tradeNote.NoteContent}</td>
                <td>{tradeNote.CompanyName} ({tradeNote.Nip})</td>
                <td>{tradeNote.Login}</td>
                <td style={{display: displayEdition}}>{renderEditionElements(tradeNote, loggedUserRole)}</td>
            </tr>
        );
    }

    function renderTableHead(loggedUserRole) {

        let displayEdition = loggedUserRole === 2 ? "block" : "none";

        return (
            <thead>
                <tr>
                    <th>Content</th>
                    <th>Connected Company</th>
                    <th>Adding User</th>
                    <th style={{display: displayEdition}}>Edit</th>
                </tr>
            </thead>
        );
    }

    function renderTableBody(loggedUserRole) {

        let tradeNoteList =  props.trade_note_list;

        return(
            <tbody>
                {tradeNoteList.map(tradeNote => renderTableRow(tradeNote, loggedUserRole))}
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
export default TradeNoteTable;