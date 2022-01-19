import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { Form, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './SearchBar.css';

function SearchBar(props) {

    const [redirect, setRedirect] = useState(false);
    const [search, setSearch] = useState("")
    const style = {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 0
    };

    function handleSubmit(event) {

        event.preventDefault();
        setSearch(event.target.search.value);
        setRedirect(true);
    }

    function renderRedirect() {
        if(redirect)
            return <Redirect to={props.path + "?search=" + search}></Redirect>
    }

    function main() {

        return (
            <Row md="auto align-middle" >
                {renderRedirect()}
                <Form onSubmit={handleSubmit}>
                <div className="searchInputs px-2 mt-2">
                    <input name="search" type="text" className='form-control' placeholder={props.placeholder} style={style} />
                    <div className="searchIcon"><SearchIcon /></div>
                </div>
                </Form>
            </Row>
        );
    }

    return main();
}
export default SearchBar;