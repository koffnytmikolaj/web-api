import { useEffect, useState } from 'react';
import { Nav } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import { ErrorView } from "../AdditionalElements/ErrorView";
import { LoadingBar } from "../AdditionalElements/LoadingBar";
import { PagePagination } from "../Pagination/PagePagination";
import UserTable from "./Table/UserTable";
import OrderSelect from "../AdditionalElements/OrderSelect";
import SearchBar from '../AdditionalElements/SearchBar/SearchBar';

function User(props) {

    const location = useLocation();
    
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(new URLSearchParams(location.search).get("page"));
    const [orderBy, setOrderBy] = useState("");
    const [descending, setDescending] = useState("false");
    const [search, setSearch] = useState("");
    const [connected, setConnected] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [currentOrder, setCurrentOrder] = useState("");

    const [rolesLoaded, setRolesLoaded] = useState(false);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const [pagesLoaded, setPagesLoaded] = useState(false);

    const orderElements = [
        ["Default", "Default"],
        ["Name", "Name"],
        ["Surname", "Surname"],
        ["DateOfBirth", "Date of birth"],
        ["Login", "Login"],
        ["RoleName", "Role"]
    ];

    const appPath = '/user/';
    const [appPathExt, setAppPathExt] = useState(appPath); 
    const rolePath = process.env.REACT_APP_API + 'role/GetRoles';
    const numberOfPagesPath = process.env.REACT_APP_API + 'user/GetNumberOfPages';
    const userPath = process.env.REACT_APP_API + 'user/GetAvailableUsers';
    

    function getRoles(firstLoad = false) {
        (
            async () => {
                await fetch(rolePath, {credentials: "include"}).then(response => 
                    response.json(),
                        (error) => {
                            if(error)
                                setConnected(false);
                            else
                                setConnected(true);
                        }
                    ).then(data => {
                        setRoleList(data);
                        if(firstLoad) {
                            setRolesLoaded(true);
                        }  
                    }
                );
            }
        )();
    }

    function getGetUsersPath() {

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
        if(curPage == null || curPage < 1)
            curPage = 1;
        setCurrentPage(curPage);

        let pageString = "?search=" + search + "&order=" + order + "&desc=" + desc + "&page=" + curPage;
        return pageString;
    }

    function getUsers(firstLoad) {

        let fetchPath = userPath + "/" + getGetUsersPath();
        (
            async () => {
                await fetch(fetchPath, {credentials: "include"}).then(response => 
                    response.json(),
                        (error) => {
                            if(error)
                                setConnected(false);
                            else
                                setConnected(true);
                        }
                ).then(data => {
                    setUserList(data);
                    if(firstLoad) {
                        setUsersLoaded(true);
                    }
                });
            }
        )();
    }

    function getNumberOfPages(firstLoad) {
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
                    if(firstLoad) {
                        setPagesLoaded(true);
                    }
                });
            }
        )();
    }
    
    function refreshList(firstLoad = false) {

        getUsers(firstLoad)
        getNumberOfPages(firstLoad);
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

    function getPrimaryData() {
        const authorization = () => {

            let loggedUser = props.logged_user;
            
            if(loggedUser === -1 || loggedUser === 0) {
                setRedirect(true);
                return false;
            }
            else {
                return true;
            }
        };
        if(authorization()) {
            getRoles(true);
            refreshList(true);
        }
        return 0;
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

        refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    useEffect(() => {

        setAppPathExt(appPath + "?order=" + orderBy + "&desc=" + descending);
        getCurrentOrder();
        refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderBy, descending]);


    function renderTableExtras() {

        if(search === "")
            return(
                <Nav className="justify-content-center mt-5">
                    <Nav.Item className="px-2">
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


        let loading = (rolesLoaded + usersLoaded + pagesLoaded + 1) * 25;
        let visibleLoading = loading !== 100;

        return(
            <div>
                <span style={{display: visibleLoading ? 'block' : 'none' }}>
                    <LoadingBar loading={loading} />
                </span>
                <span 
                    style={{display: visibleLoading ? 'none' : 'block' }}
                >
                    {renderOrderSelect()}
                    <UserTable 
                        roleList={roleList} 
                        userList={userList}
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
        else if(connected)
            return renderContent();
        else
            return <ErrorView />
    }

    return main();
}
export default User;