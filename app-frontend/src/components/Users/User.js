import { useEffect, useState } from 'react';
import { Nav } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import { ErrorView } from "../AdditionalElements/ErrorView";
import { LoadingBar } from "../AdditionalElements/LoadingBar";
import { PagePagination } from "../Pagination/PagePagination";
import UserTable from "./Table/UserTable";

function User(props) {

    const location = useLocation();
    
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(new URLSearchParams(location.search).get("page"));
    const [connected, setConnected] = useState(true);
    const [redirect, setRedirect] = useState(false);

    const [rolesLoaded, setRolesLoaded] = useState(false);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const [pagesLoaded, setPagesLoaded] = useState(false);

    const appPath = '/user/';
    const rolePath = process.env.REACT_APP_API + 'role/GetRoles';
    const numberOfPagesPath = process.env.REACT_APP_API + 'user/GetNumberOfPages';
    const fetchPath = process.env.REACT_APP_API + 'user/GetAvailableUsers';
    

    function getRoles(firstLoad = false) {
        (
            async () => {
                await fetch(rolePath).then(response => 
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

        let curPage = new URLSearchParams(location.search).get("page");
        if(curPage == null || curPage < 1)
            curPage = 1;
        setCurrentPage(curPage);
        return "?page=" + curPage;
    }

    function getUsers(firstLoad) {

        let getUsersPath = fetchPath + "/" + getGetUsersPath();
        (
            async () => {
                await fetch(getUsersPath).then(response => 
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


    function renderTableExtras() {

        return(
            <Nav className="justify-content-center mt-5">
                <Nav.Item className="px-2">
                    <PagePagination 
                        appPath={appPath} 
                        numberOfPages={numberOfPages} 
                        currentPage={currentPage}
                    />
                </Nav.Item>
            </Nav>
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

        console.log("location", location);
        console.log(currentPage);
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