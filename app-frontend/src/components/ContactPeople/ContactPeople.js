import React, {useEffect, useState} from "react";
import { Redirect, useLocation } from "react-router-dom";
import { ErrorView } from "../AdditionalElements/ErrorView";
import { LoadingBar } from "../AdditionalElements/LoadingBar";
import { Button, Nav } from "react-bootstrap";
import AddContactPersonModal from "./AddContactPersonModal";
import { PagePagination } from "../Pagination/PagePagination";
import SearchBar from "../AdditionalElements/SearchBar/SearchBar";
import OrderSelect from "../AdditionalElements/OrderSelect";
import ContactPersonTable from "./Table/ContactPeopleTable";

function ContactPeople(props) {

  const location = useLocation();

  const [redirect, setRedirect] = useState(false);
  const [connected, setConnected] = useState(true);
  const [commpanyList, setCompanyList] = useState([]);
  const [contactPeopleList, setContactPeopleList] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [currentOrder, setCurrentOrder] = useState("")
  const [descending, setDescending] = useState(false);

  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [numberOfPagesLoaded, setNumberOfPagesLoaded] = useState(false);
  const [contactPeopleLoaded, setContactPeopleLoaded] = useState(false);


  const orderElements = [
    ["Default", "Default"],
    ["Name", "Name"],
    ["Surname", "Surname"],
    ["PhoneNumber", "Phone number"],
    ["Email", "E-mail"],
    ["CompanyName", "Company Name"],
    ["Nip", "NIP"],
    ["Login", "Adding User"]
  ];

  const appPath = '/contact_people/';
  const [appPathExt, setAppPathExt] = useState(appPath);
  const fetchPath = process.env.REACT_APP_API + 'contactPeople/GetContactPeople';
  const companyPath = process.env.REACT_APP_API + 'company/GetAllCompanies';
  const numberOfPagesPath = process.env.REACT_APP_API + 'contactPeople/GetNumberOfPages';

  function checkAuthorization() {

    let user = props.logged_user;
    if(user === -1 || user === 0) {
      setRedirect(true);
      return false;
    }
  }

  function getNumberOfPages() {

    let numberOfPages;
    (
        async () => {
          await fetch(numberOfPagesPath, {credentials: "include"}).then(response => 
            response.json(),
              (error) => {
                if(error)
                  setConnected(false);
                else
                  setConnected(true);
              }
            )
          .then(response => {
            setNumberOfPages(response);
            setNumberOfPagesLoaded(true);
            numberOfPages = response;
          });
        }
    )();
    return numberOfPages;
  }

  function getPageParams() {

    let numberOfPages = getNumberOfPages();

    let params = new URLSearchParams(location.search);

    let search = params.get("search");
    if(search == null)
      search = "";
    setSearch(search);

    let desc = params.get("desc");
    if(desc == null || (desc !== "true" && desc !== "false"))
      desc = "false";
    setDescending(desc);

    let order = params.get("order");
    if(order == null)
      order = "default";
    setOrderBy(order);

    let curPage = params.get("page");
    if(curPage == null || curPage < 1 || curPage > numberOfPages)
        curPage = 1;
    setCurrentPage(curPage);

    let pageString = "?search=" + search + "&order=" + order + "&desc=" + desc + "&page=" + curPage;
    return pageString;
  }

  function getContactPeople() {

    let contactPeoplePath = fetchPath + getPageParams();
    (
      async () => {
        await fetch(contactPeoplePath, {credentials: "include"}).then(response => 
          response.json(),
            (error) => {
              if(error){
                setConnected(false);
              }
              else
                setConnected(true);
            }
        ).then(data => {
            setContactPeopleList(data);
            setContactPeopleLoaded(true);
        });
      }
    )();
  }

  function getCompanies() {
    (
      async () => {
        await fetch(companyPath, {credentials: "include"}).then(response => 
          response.json(),
            (error) => {
              if(error){
                setConnected(false);
              }
              else
                setConnected(true);
            }
        ).then(data => {
            setCompanyList(data);
            setCompaniesLoaded(true);
        });
      }
    )();
  }

  function getPrimaryData() {

    checkAuthorization();
    getContactPeople();
    getCompanies();

  }

  function getCurrentOrder() {

    let orderIndex;
    for(let i = 0; i < orderElements.length; i++) {
        if(orderElements[i][0] === orderBy) {
            orderIndex = i;
            break;
        }
        if(i === orderElements.length - 1)
            orderIndex = 0;
    }
    let descIndex = descending === "false" ? 0 : 1;
    setCurrentOrder(orderElements[orderIndex][0] + descIndex);
}

  useEffect(() => {
    (
      async () => {
        getPrimaryData();
      }
    )();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    getContactPeople();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {

    setAppPathExt(appPath + "?order=" + orderBy + "&desc=" + descending);
    getCurrentOrder();
    getContactPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, descending]);


  function renderAddContactPersonButton() {

    return(
      <Button className="m-2" variant="primary" onClick={()=> {
          setAddModalShow(true);
      }}>
        Add contact person
      </Button>
  );
  }
  
  function renderAddContactPersonModal() {

    return(
      <AddContactPersonModal
          show={addModalShow}
          onHide={()=> setAddModalShow(false)}
          company_list={commpanyList}
      />
    );
  }

  function renderAddContactPerson() {

    return (
      <>
        {renderAddContactPersonButton()}
        {renderAddContactPersonModal()}
      </>
    )
  }
  
  function renderTableExtras() {

    if(search === "")
      return (
        <Nav className="justify-content-center mt-5">
          <Nav.Item className="px-2">
            {renderAddContactPerson()}
            <PagePagination
                appPath={appPathExt} 
                numberOfPages={numberOfPages} 
                currentPage={currentPage}
            />
          </Nav.Item>
        </Nav>
      );
  }

  function renderOrderSelect() {

    return (
        <div className="d-flex flex-row-reverse">
            <SearchBar placeholder={"Search user"} path={appPath} />
            <OrderSelect order_list={orderElements} path={appPath} curOrder={currentOrder} />
        </div>
    );
}
  
  function renderContent() {

    let loading = (numberOfPagesLoaded + companiesLoaded + contactPeopleLoaded + 1) * 25;
    let dataLoaded = loading === 100;

    if(dataLoaded)
      return (
        <span>
          {renderOrderSelect()}
          <ContactPersonTable
            company_list={commpanyList}
            contact_people_list={contactPeopleList}
            logged_user={props.logged_user}
          />
          {renderTableExtras()}
        </span>
      );
    else
      return(
        <span>
          <LoadingBar loading={loading} loadingNumber={false} />
        </span>
    );
}
  
  function redirectToHome() {

    return(
      <Redirect to="/"></Redirect>
    );
  }

  function main() {

    if(redirect)
      return redirectToHome();
    else if(connected) {
      return (
        renderContent()
      );
    }
    else {
      return <ErrorView />;
    }
  }

  return main();
}
export default ContactPeople;