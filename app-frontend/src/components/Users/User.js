import React, {Component} from "react";
import { Button, Nav } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { ErrorView } from "../AdditionalElements/ErrorView";
import { LoadingBar } from "../AdditionalElements/LoadingBar";
import { PagePagination } from "../Pagination/PagePagination";
import { UserTable } from "./Table/UserTable";

export class User extends Component {
    
    constructor(props) {

        super(props);
        this.state = {
            userList: [],
            roleList: [],
            numberOfPages: 0,
            currentPage: 1,
            userAuthorized: null,
            connected: true,
            dataLoaded: 1,
            
        }
    }

    _isMounted = false;
    showAll = false;

    appPath = '/user/';
    rolePath = process.env.REACT_APP_API + 'role/GetRoles';
    availableUsersPath = process.env.REACT_APP_API + 'user/GetAvailableUsers';
    allUsersPath = process.env.REACT_APP_API + 'user/GetAllUsers';
    numberOfPagesPath = process.env.REACT_APP_API + 'user/GetNumberOfPages';
    deletePath = process.env.REACT_APP_API + 'user/DeleteUser';
    fetchPath = this.availableUsersPath;

    async getRoles(firstLoad = false) {

        await fetch(this.rolePath).then(response => 
            response.json(),
                (error) => {
                    if(error)
                        this.setState({connected: false});
                    else
                        this.setState({connected: true});
                }
            ).then(data => {
                if(this._isMounted) {
                    this.setState({roleList: data});
                    if(firstLoad)
                        this.setState({dataLoaded: this.state.dataLoaded + 1});
                }
            }
        );
    }

    getPageNumber() {

        let pageNumber = this.props.location.pathname.substr(6);
        if(pageNumber !== "")
            return pageNumber
        else
            return 1;
    }

    getGetUsersPath() {

        let currentPage = this.getPageNumber();
        this.setState({currentPage: currentPage});
        return this.fetchPath + "/?page=" + currentPage;
    }

    async getUsers(firstLoad) {

        let getUsersPath = this.getGetUsersPath();

        await fetch(getUsersPath).then(response => 
            response.json(),
                (error) => {
                    if(error)
                        this.setState({connected: false});
                    else
                        this.setState({connected: true});
                }
            ).then(data => {
                if(this._isMounted) {
                    this.setState({userList:data});
                    if(firstLoad)
                        this.setState({dataLoaded: this.state.dataLoaded + 1});
                }
            });
    }

    getGetNumberOfPagesPath() {

        return this.numberOfPagesPath + "?all=" + this.showAll;
    }

    async getNumberOfPages(firstLoad) {

        let getNumberOfPagesPath = this.getGetNumberOfPagesPath();

        await fetch(getNumberOfPagesPath).then(response => 
            response.json(),
                (error) => {
                    if(error)
                        this.setState({connected: false});
                    else
                        this.setState({connected: true});
                }
            )
        .then(response => {
            if(this._isMounted) {
                this.setState({numberOfPages: response});
                if(firstLoad)
                    this.setState({dataLoaded: this.state.dataLoaded + 1});
            }
        });
    }
    
    async refreshList(firstLoad = false) {

        this.getUsers(firstLoad)
        this.getNumberOfPages(firstLoad);
    }


    componentDidMount() {

        this._isMounted = true;
        this.getRoles(true);
        this.refreshList(true);
    }

    componentWillUnmount() {

        this._isMounted = false;
    }


    delete_RestoreUser(user) {

        if(window.confirm("Are You sure, You want to " + (user.IsDeleted ? "restore" : "delete") + " this user?")) {
            fetch(this.deletePath, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: user.UserId,
                    IsDeleted: user.IsDeleted
                })
            }, (error) => {
                alert("Failed!\n" + error);
            });
        }
    }

    checkAuthorization() {

        return !(this.props.logged_user === -1 || this.props.logged_user === 0);
    }

    redirect() {

        return(
            <Redirect to="/"></Redirect>
        );
    }


    renderShowUsersButton() {

        let buttonName = this.showAll ? 'Show available users' : 'Show all users';
        let clickPath = this.showAll ? this.availableUsersPath : this.allUsersPath;
        
        return(
            <Button
                variant='primary' 
                onClick={()=> {
                    this.fetchPath = clickPath;
                    this.showAll = !this.showAll;
                    this.refreshList();
                }}
            >
                {buttonName}
            </Button>
        );
    }

    renderTableExtras() {

        return(
            <Nav className="justify-content-center mt-5">
                <Nav.Item className="px-2">
                    <PagePagination 
                        appPath={this.appPath} 
                        numberOfPages={this.state.numberOfPages} 
                        currentPage={this.state.currentPage} />
                </Nav.Item>
                <Nav.Item className="px-2">
                    {this.renderShowUsersButton()}
                </Nav.Item>
            </Nav>
        );
    }

    renderContent() {

        let loading = this.state.dataLoaded * 25;
        let visibleLoading = loading !== 100;

        return(
            <div>
                <span style={{display: visibleLoading ? 'block' : 'none' }}>
                    <LoadingBar loading={loading} />
                </span>
                <span style={{display: visibleLoading ? 'none' : 'block' }}>
                    <UserTable 
                        roleList={this.state.roleList} 
                        userList={this.state.userList}
                        logged_user={this.props.logged_user}
                    />
                    {this.renderTableExtras()}
                </span>
            </div>
        );
    }

    renderErrorView() {

        return(
            <div>
                Database failure! Come back later.
            </div>
        );
    }

    render() {

        if(!this.checkAuthorization())
            return this.redirect();
            
        if(this.state.connected)
            return this.renderContent();
        else
            return <ErrorView />
    }
}
