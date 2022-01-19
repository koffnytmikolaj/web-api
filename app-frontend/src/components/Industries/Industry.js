import React, {useEffect, useState} from "react";
import { Redirect, useLocation } from "react-router-dom";
import { ErrorView } from "../AdditionalElements/ErrorView";
import { LoadingBar } from "../AdditionalElements/LoadingBar";
import IndustryTable from "./Table/IndustryTable";
import { Button, Nav } from "react-bootstrap";
import AddIndustryModal from "./AddIndustryModal";
import { PagePagination } from "../Pagination/PagePagination";
import SearchBar from "../AdditionalElements/SearchBar/SearchBar";
import OrderSelect from "../AdditionalElements/OrderSelect";

function Industry(props) {

  const location = useLocation();

  const [redirect, setRedirect] = useState(false);
  const [connected, setConnected] = useState(true);
  const [industryList, setIndustryList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [currentOrder, setCurrentOrder] = useState("")
  const [descending, setDescending] = useState(false);

  const orderElements = [
    ["Default", "Default"]
  ];

  const appPath = '/industry/';
  const [appPathExt, setAppPathExt] = useState(appPath);
  const fetchPath = process.env.REACT_APP_API + 'industry/GetIndustries';
  const numberOfPagesPath = process.env.REACT_APP_API + 'industry/GetNumberOfPages';

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
          await fetch(numberOfPagesPath).then(response => 
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
            setDataLoaded(true);
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

  function getIndustries() {

    let industryPath = fetchPath + getPageParams();
    (
      async () => {
        await fetch(industryPath).then(response => 
          response.json(),
            (error) => {
              if(error){
                setConnected(false);
              }
              else
                setConnected(true);
            }
        ).then(data => {
            setIndustryList(data);
            setDataLoaded(true);
        });
      }
    )();
  }

  function getPrimaryData() {

    checkAuthorization();
    getIndustries();
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

    getIndustries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {

    setAppPathExt(appPath + "?order=" + orderBy + "&desc=" + descending);
    getCurrentOrder();
    getIndustries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, descending]);


  function renderAddUserButton() {

    return(
      <Button className="m-2" variant="primary" onClick={()=> {
          setAddModalShow(true);
      }}>
        Add industry
      </Button>
  );
  }
  
  function renderAddUserModal() {

    return(
      <AddIndustryModal
          show={addModalShow}
          onHide={()=> setAddModalShow(false)}
      />
    );
  }

  function renderAddUser() {

    return (
      <>
        {renderAddUserButton()}
        {renderAddUserModal()}
      </>
    )
  }
  
  function renderTableExtras() {

    if(search === "")
      return (
        <Nav className="justify-content-center mt-5">
          <Nav.Item className="px-2">
            {renderAddUser()}
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

    return(
      <div>
        <span style={{display: dataLoaded ? 'none' : 'block' }}>
          <LoadingBar loading={100} loadingNumber={false} />
        </span>
        <span style={{display: dataLoaded ? 'block' : 'none' }}>
          {renderOrderSelect()}
          <IndustryTable
            industryList={industryList}
            logged_user={props.logged_user}
          />
          {renderTableExtras()}
        </span>
      </div>
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
export default Industry;